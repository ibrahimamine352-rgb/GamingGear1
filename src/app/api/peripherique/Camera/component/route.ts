import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { slugify } from '@/lib/slugify';

/* ---------- shared filter types (local, no client import) ---------- */
type CheckItem = {
  id: number;
  searchKey: string;
};

type CheckItemGroupsScreen = {
  mark: CheckItem[];
  pouce: CheckItem[];
  refreshRate: CheckItem[];
  resolution: CheckItem[];
};

/* =============================== POST =============================== */

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
      description,
      comingSoon,
      outOfStock,
      stock,
      additionalDetails = [],
      CameraTypeId,
      manufacturerId,
      dicountPrice = 0,
    } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
    }

    if (price == null) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    if (stock == null) {
      return new NextResponse('Stock is required', { status: 400 });
    }

    // slug for SEO
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const product = await prismadb.camera.create({
      data: {
        manufacturerId,
        // or whatever your Prisma field actually is:
        mousepadModelId: CameraTypeId,
        product: {
          create: {
            slug,
            name,
            price,
            isFeatured,
            isArchived,
            comingSoon,
            outOfStock,
            description,
            stock,
            dicountPrice,
            category: {
              connect: { id: categoryId },
            },
            additionalDetails: additionalDetails.length
              ? {
                  createMany: {
                    data: [...additionalDetails],
                  },
                }
              : undefined,
            images: {
              createMany: {
                data: images.map((image: { url: string }) => ({
                  url: image.url,
                })),
              },
            },
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

/* =============================== GET ================================ */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url || '', 'http://localhost');

    const page = parseInt(searchParams.get('page') || '0', 10);
    const units = parseInt(searchParams.get('units') || '14', 10) || 14;
    const q = searchParams.get('q') || '';
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort') || '';
    const maxDt = searchParams.get('maxDt') || '';
    const minDt = searchParams.get('minDt') || '';
    const motherboardId = searchParams.get('motherboardId') || '';

    const whereClause: Record<string, any> = {
      isArchived: false,
      screens: {
        some: {},
      },
    };

    if (q) {
      whereClause.name = {
        contains: q,
        mode: 'insensitive',
      };
    }

    let orderByClause: Record<string, 'asc' | 'desc'> = {};

    if (sort && sort.length > 0) {
      switch (sort) {
        case 'Les plus populaires':
          orderByClause = { soldnumber: 'desc' };
          break;
        case 'Les plus récents':
          orderByClause = { createdAt: 'desc' }; // or 'asc' if you want oldest first
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
      // default sort
      orderByClause = { createdAt: 'desc' };
    }

    const filterListParam = searchParams.get('filterList');

    if (filterListParam) {
      const decodedFilterList = JSON.parse(
        decodeURIComponent(filterListParam)
      ) as CheckItemGroupsScreen;

      const cpuFilters: any[] = [];

      const chipsetFilter = decodedFilterList.mark;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
          Mark: {
            name: {
              in: decodedFilterList.mark.map((item) => item.searchKey),
            },
          },
        });
      }

      const motherboardscreensupportFilter = decodedFilterList.pouce;
      if (motherboardscreensupportFilter && motherboardscreensupportFilter.length > 0) {
        cpuFilters.push({
          Pouce: {
            name: {
              in: decodedFilterList.pouce.map((item) => item.searchKey),
            },
          },
        });
      }

      const refreshRate = decodedFilterList.refreshRate;
      if (refreshRate && refreshRate.length > 0) {
        cpuFilters.push({
          RefreshRate: {
            name: {
              in: decodedFilterList.refreshRate.map((item) => item.searchKey),
            },
          },
        });
      }

      const resolution = decodedFilterList.resolution;
      if (resolution && resolution.length > 0) {
        cpuFilters.push({
          resolution: {
            name: {
              in: decodedFilterList.resolution.map((item) => item.searchKey),
            },
          },
        });
      }

      if (maxDt.length > 0) {
        whereClause.price = {
          lte: parseInt(maxDt, 10),
        };
        if (minDt.length > 0) {
          whereClause.price = {
            ...(whereClause.price || {}),
            gte: parseInt(minDt, 10),
          };
        }
      }

      if (cpuFilters.length > 0) {
        whereClause.screens = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    }

    const products = await prismadb.product.findMany({
      where: whereClause,
      include: {
        images: true,
      },
      orderBy: orderByClause,
      take: units,
      skip: page * units,
    });

    const total = await prismadb.product.count({
      where: whereClause,
    });

    return NextResponse.json({ data: products, total });
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
