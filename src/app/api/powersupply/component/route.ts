import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { slugify } from '@/lib/slugify';

// Local filter type – don't import from client components
type CheckItem = { id: number; searchKey: string };
type CheckItemGroupsPower = {
  powersupplyMarque: CheckItem[];
  psCertification: CheckItem[];
};

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
      description,
      stock,
      additionalDetails = [],
      certification80ID,
      powersupplyMarqueID,
      modularity,
      Power,
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

    if (!certification80ID) {
      return new NextResponse('certification80ID is required', { status: 400 });
    }

    if (!powersupplyMarqueID) {
      return new NextResponse('powersupplyMarqueID is required', { status: 400 });
    }

    // Optional sanity check (kept from your code)
    await prismadb.psCertification.findUnique({
      where: { id: certification80ID },
    });

    // SEO slug for Product
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const product = await prismadb.powersupply.create({
      data: {
        powersupplyMarqueId: powersupplyMarqueID,
        modularity,
        Power,
        certificationId: certification80ID,
        products: {
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

            // connect category relation
            category: {
              connect: { id: categoryId },
            },

            images: {
              createMany: {
                data: images.map((image: { url: string }) => ({
                  url: image.url,
                })),
              },
            },

            additionalDetails: additionalDetails.length
              ? {
                  createMany: {
                    data: [...additionalDetails],
                  },
                }
              : undefined,
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

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
      powersupplies: {
        some: {},
      },
    };

    if (isFeatured) {
      whereClause.isFeatured = true;
    }

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
          orderByClause = {
            soldnumber: 'desc',
          };
          break;
        case 'Les plus récents':
          orderByClause = {
            price: 'desc',
          };
          break;
        case 'Prix : Croissant':
          orderByClause = {
            price: 'asc',
          };
          break;
        case 'Prix : Décroissant':
          orderByClause = {
            price: 'desc',
          };
          break;
        default:
          orderByClause = {
            price: 'asc',
          };
      }
    } else {
      orderByClause = {
        price: 'asc',
      };
    }

    const filterListParam = searchParams.get('filterList');

    if (filterListParam) {
      const decodedFilterList = JSON.parse(
        decodeURIComponent(filterListParam)
      ) as CheckItemGroupsPower;

      const cpuFilters: any[] = [];

      const marqueFilter = decodedFilterList.powersupplyMarque;
      if (marqueFilter && marqueFilter.length > 0) {
        cpuFilters.push({
          Marque: {
            name: {
              in: decodedFilterList.powersupplyMarque.map((item) => item.searchKey),
            },
          },
        });
      }

      const certFilter = decodedFilterList.psCertification;
      if (certFilter && certFilter.length > 0) {
        cpuFilters.push({
          certification: {
            name: {
              in: decodedFilterList.psCertification.map((item) => item.searchKey),
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
        whereClause.powersupplies = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    }

    if (motherboardId.length > 0) {
      const prossa = await prismadb.compatibiltyProfile.findMany({
        where: {
          motherboards: {
            some: {
              productId: {
                equals: motherboardId,
              },
            },
          },
        },
        include: {
          powersupplys: true,
        },
      });

      if (prossa.length > 0) {
        whereClause.id = {
          in: prossa
            .flatMap((e) => e.powersupplys.map((ee) => ee.productId))
            .filter((productId) => productId !== undefined),
        };
      }
    }

    const products = await prismadb.product.findMany({
      where: whereClause,
      include: {
        powersupplies: true,
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
