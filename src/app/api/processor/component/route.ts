import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { NextApiResponse } from 'next';
import { checkItemGroupsCPU } from '@/app/(storefront)/build-pc/_componenets/Processor';

export async function POST(
  req: Request,
  { params }: { params: {} }
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
      // IMPORTANT: use the same key we send from the form:
      cpusupportId, // <-- rename from supportduprocesseurId
      description,
      stock,
      additionalDetails,
      dicountPrice, // include if you want to store it on product
    } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!images || !images.length) return new NextResponse("Images are required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category id is required", { status: 400 });

    // If your Prisma schema uses Int ids for these, coerce them:
    // const pmId = Number(processorModelId);
    // const csId = Number(cpusupportId);

    const processor = await prismadb.processor.create({
      data: {
        processorModel: {
          connect: { id: processorModelId }, // or pmId
        },
        cpusupport: {
          connect: { id: cpusupportId }, // or csId
        },
        products: {
          create: {
            name,
            price,
            categoryId,
            isFeatured,
            isArchived,
            comingSoon,
            outOfStock,
            description,
            stock,
            dicountPrice,
            images: {
              createMany: {
                // Prisma expects [{ url }]
                data: images.map((img: { url: string }) => ({ url: img.url })),
              },
            },
            additionalDetails: {
              // ensure {name, value}
              createMany: {
                data: (additionalDetails ?? []).map((d: { name: string; value: string }) => ({
                  name: d.name,
                  value: d.value,
                })),
              },
            },
          },
        },
      },
    });

    return NextResponse.json(processor);
  } catch (error) {
    console.log('[PROCESSOR_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url || '', 'http://localhost');

    const page = parseInt(searchParams.get('page') || '0');
    const units = parseInt(searchParams.get('units') || '14') || 14;
    const q = searchParams.get('q') || '';
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort') || '';
    const maxDt = searchParams.get('maxDt') || '';
    const minDt = searchParams.get('minDt') || '';
    const motherboardId = searchParams.get('motherboardId') || '';

    const whereClause: Record<string, any> = {
      isArchived: false,
      cpus: {
        some: {},
      },
    };

    if (q) {
      whereClause.name = { contains: q, mode: 'insensitive' };
    }

    let orderByClause: Record<string, 'asc' | 'desc'> = {};
    if (sort && sort.length > 0) {
      switch (sort) {
        case 'Les plus populaires':
          orderByClause = { soldnumber: 'desc' };
          break;
        case 'Les plus récents':
          orderByClause = { price: 'desc' };
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

    const filterListParam = searchParams.get('filterList');
    if (filterListParam) {
      const decodedFilterList = JSON.parse(decodeURIComponent(filterListParam)) as checkItemGroupsCPU;

      const cpuFilters: any[] = [];

      const chipsetFilter = decodedFilterList.cPUSupport;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
          cpusupport: {
            name: {
              in: decodedFilterList.cPUSupport.map(item => item.searchKey),
            },
          },
        });
      }

      const motherboardcpusupportFilter = decodedFilterList.processorModel;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        cpuFilters.push({
          processorModel: {
            name: {
              in: decodedFilterList.processorModel.map(item => item.searchKey),
            },
          },
        });
      }

      if (maxDt.length > 0) {
        whereClause.price = { lte: parseInt(maxDt) };
        if (minDt.length > 0) {
          whereClause.price = { ...(whereClause.price || {}), gte: parseInt(minDt) };
        }
      }

      if (cpuFilters.length > 0) {
        whereClause.cpus = { some: { AND: cpuFilters } };
      }
    }

    if (motherboardId.length > 0) {
      const prossa = await prismadb.compatibiltyProfile.findMany({
        where: {
          motherboards: { some: { productId: { equals: motherboardId } } },
        },
        include: { CPUs: true },
      });

      if (prossa.length > 0) {
        whereClause.id = {
          in: prossa.flatMap((e) => e.CPUs.map((ee) => ee.productId)).filter((productId) => productId !== undefined),
        };
      }
    }

    const products = await prismadb.product.findMany({
      where: whereClause,
      include: {
        motherboard: true,
        images: true,
        category: true,
      },
      orderBy: orderByClause,
      take: units,
      skip: page * units,
    });

    const total = await prismadb.product.count({ where: whereClause });

    return NextResponse.json({ data: products, total });
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    res.status(500).json({ error: 'Internal error' });
  }
}
