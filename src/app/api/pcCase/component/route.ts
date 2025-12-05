import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { slugify } from '@/lib/slugify';

// Define the filter type locally instead of importing from a client component
type CheckItem = { id: number; searchKey: string };
type CheckItemGroupsCase = {
  pCcaseBrand: CheckItem[];
  pCcaseCaseformat: CheckItem[];
  pCcaseNumberofFansPreinstalled: CheckItem[];
  pCcaseRGBType: CheckItem[];
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
      brandId,
      caseformatiD,
      numberofFansPreinstalledId,
      rGBTypeId,
      description,
      stock,
      dicountPrice,
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

    // you probably also always have stock, but only enforce if you want
    // if (stock == null) {
    //   return new NextResponse('Stock is required', { status: 400 });
    // }

    console.log('dazdz');

    // ✅ SEO slug for Product
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const product = await prismadb.pCcase.create({
      data: {
        brandId,
        caseformatiD,
        numberofFansPreinstalledId,
        rGBTypeId,
        product: {
          create: {
            slug, // ✅ required by Product model
            name,
            price,
            isFeatured,
            isArchived,
            comingSoon,
            outOfStock,
            description,
            stock,
            dicountPrice: dicountPrice ?? 0,
            // ✅ connect to category relation instead of categoryId field
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
      cases: {
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
      ) as CheckItemGroupsCase;

      const cpuFilters: any[] = [];

      const chipsetFilter = decodedFilterList.pCcaseBrand;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
          brand: {
            name: {
              in: decodedFilterList.pCcaseBrand.map((item) => item.searchKey),
            },
          },
        });
      }

      const motherboardcpusupportFilter = decodedFilterList.pCcaseCaseformat;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        cpuFilters.push({
          caseformat: {
            name: {
              in: decodedFilterList.pCcaseCaseformat.map((item) => item.searchKey),
            },
          },
        });
      }

      const pCcaseNumberofFansPreinstalled =
        decodedFilterList.pCcaseNumberofFansPreinstalled;
      if (pCcaseNumberofFansPreinstalled && pCcaseNumberofFansPreinstalled.length > 0) {
        cpuFilters.push({
          numberofFansPreinstalled: {
            name: {
              in: decodedFilterList.pCcaseNumberofFansPreinstalled.map(
                (item) => item.searchKey
              ),
            },
          },
        });
      }

      const pCcaseRGBType = decodedFilterList.pCcaseRGBType;
      if (pCcaseRGBType && pCcaseRGBType.length > 0) {
        cpuFilters.push({
          rGBType: {
            name: {
              in: decodedFilterList.pCcaseRGBType.map((item) => item.searchKey),
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
        whereClause.cases = {
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
          cases: true,
        },
      });

      if (prossa.length > 0) {
        whereClause.id = {
          in: prossa
            .flatMap((e) => e.cases.map((ee) => ee.productId))
            .filter((productId) => productId !== undefined),
        };
        console.log(whereClause.id);
      }
    }

    console.log(whereClause);

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

    console.log();

    return NextResponse.json({ data: products, total });
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return NextResponse.json(
      { data: [], total: 0, error: 'Internal error' },
      { status: 500 }
    );
  }
}
