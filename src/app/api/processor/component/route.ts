import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { checkItemGroupsCPU } from '@/app/(storefront)/build-pc/_componenets/Processor';

// ------------------------------
// POST  /api/processor/component
// Create ONE product + its OWN CPU row (no shared Processor).
// ------------------------------
export async function POST(
  req: Request,
  _ctx: { params: {} }
) {
  try {
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      images,
      isFeatured,
      isArchived,
      comingSoon,
      outOfStock,
      processorModelId,
      cpusupportId,       // <-- IMPORTANT: matches your form field name
      description,
      stock,
      additionalDetails,
      dicountPrice,
    } = body;

    if (!name) return new NextResponse('Name is required', { status: 400 });
    if (!images || !images.length) return new NextResponse('Images are required', { status: 400 });
    if (price === undefined || price === null) return new NextResponse('Price is required', { status: 400 });
    if (!categoryId) return new NextResponse('Category id is required', { status: 400 });
    if (!processorModelId) return new NextResponse('Processor model is required', { status: 400 });
    if (!cpusupportId) return new NextResponse('CPU support is required', { status: 400 });

    // 1) Create a dedicated CPU row for THIS product (do not reuse a shared one)
    const cpu = await prismadb.processor.create({
      data: {
        processorModel: { connect: { id: processorModelId } },
        cpusupport: { connect: { id: cpusupportId } },
      },
    });

    // 2) Create the product
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        description,
        stock,
        dicountPrice: dicountPrice ?? 0,
        isFeatured: !!isFeatured,
        isArchived: !!isArchived,
        comingSoon: !!comingSoon,
        outOfStock: !!outOfStock,

        images: {
          createMany: {
            data: images.map((img: { url: string }) => ({ url: img.url })),
          },
        },

        additionalDetails: {
          createMany: {
            data: (additionalDetails ?? []).map((d: { name: string; value: string }) => ({
              name: d.name,
              value: d.value,
            })),
          },
        },
      },
    });

    // 3) Link ONLY that new CPU to the product (ensure no other CPUs are attached)
    await prismadb.product.update({
      where: { id: product.id },
      data: {
        cpus: {
          set: [{ id: cpu.id }], // replaces any existing CPU links for safety
        },
      },
    });

    // Optionally return the full product with relations
    const full = await prismadb.product.findUnique({
      where: { id: product.id },
      include: { images: true, additionalDetails: true, cpus: { include: { processorModel: true, cpusupport: true } } },
    });

    return NextResponse.json(full);
  } catch (error) {
    console.error('[PROCESSOR_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// ------------------------------
// GET  /api/processor/component
// List processors (products with cpus) + filters + pagination.
// ------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '0', 10);
    const units = parseInt(searchParams.get('units') || '14', 10) || 14;
    const q = searchParams.get('q') || '';

    const isFeatured = searchParams.get('isFeatured'); // (kept in case you use it later)
    const sort = searchParams.get('sort') || '';
    const maxDt = searchParams.get('maxDt') || '';
    const minDt = searchParams.get('minDt') || '';
    const motherboardId = searchParams.get('motherboardId') || '';

    const whereClause: Record<string, any> = {
      isArchived: false,
      cpus: {
        some: {}, // we only want products that have at least one CPU linked
      },
    };

    if (q) {
      whereClause.name = { contains: q, mode: 'insensitive' };
    }

    // Sorting
    let orderByClause: Record<string, 'asc' | 'desc'> = {};
    if (sort && sort.length > 0) {
      switch (sort) {
        case 'Les plus populaires':
          orderByClause = { soldnumber: 'desc' };
          break;
        case 'Les plus récents':
          orderByClause = { price: 'desc' }; // you might want createdAt: 'desc' instead
          break;
        case 'Prix : Croissant':
          orderByClause = { price: 'asc' };
          break;
        case 'Prix : Décroissant':
          orderByClause = { price: 'desc' };
          break;
        default:
          orderByClause = { createdAt: 'desc' };
      }
    } else {
      orderByClause = { price: 'asc' };
    }

    // Filters
    const filterListParam = searchParams.get('filterList');
    if (filterListParam) {
      const decodedFilterList = JSON.parse(decodeURIComponent(filterListParam)) as checkItemGroupsCPU;

      const cpuFilters: any[] = [];

      // Filter by CPU Support (e.g., AM5, LGA1700)
      const cpuSupportFilter = decodedFilterList.cPUSupport;
      if (cpuSupportFilter && cpuSupportFilter.length > 0) {
        cpuFilters.push({
          cpusupport: {
            name: {
              in: cpuSupportFilter.map((item) => item.searchKey),
            },
          },
        });
      }

      // Filter by Processor Model (e.g., AMD, Intel)
      const processorModelFilter = decodedFilterList.processorModel;
      if (processorModelFilter && processorModelFilter.length > 0) {
        cpuFilters.push({
          processorModel: {
            name: {
              in: processorModelFilter.map((item) => item.searchKey),
            },
          },
        });
      }

      // Price range
      if (maxDt.length > 0) {
        whereClause.price = { lte: parseInt(maxDt, 10) };
        if (minDt.length > 0) {
          whereClause.price = { ...(whereClause.price || {}), gte: parseInt(minDt, 10) };
        }
      }

      if (cpuFilters.length > 0) {
        whereClause.cpus = { some: { AND: cpuFilters } };
      }
    }

    // Compatibility (when motherboardId provided)
    if (motherboardId.length > 0) {
      const prossa = await prismadb.compatibiltyProfile.findMany({
        where: {
          motherboards: { some: { productId: { equals: motherboardId } } },
        },
        include: { CPUs: true },
      });

      if (prossa.length > 0) {
        whereClause.id = {
          in: prossa
            .flatMap((e) => e.CPUs.map((ee) => ee.productId))
            .filter((pid) => pid !== undefined),
        };
      }
    }

    const products = await prismadb.product.findMany({
      where: whereClause,
      include: {
        motherboard: true,
        images: true,
        category: true,
        cpus: { include: { processorModel: true, cpusupport: true } },
      },
      orderBy: orderByClause,
      take: units,
      skip: page * units,
    });

    const total = await prismadb.product.count({ where: whereClause });

    return NextResponse.json({ data: products, total });
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
