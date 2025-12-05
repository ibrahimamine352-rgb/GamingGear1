import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { checkItemGroupsCase } from '@/app/(storefront)/build-pc/_componenets/Case';
import { checkItemGroupsCooling } from '@/app/(storefront)/build-pc/_componenets/Cooling';
import { slugify } from "@/lib/slugify";

export async function POST(
  req: Request,
  { params }: { params: {} }
) {
  try {
    const body = await req.json();

    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      comingSoon,
      outOfStock,
      CPUSupportId,
      CoolingMarkId,
      CoolingTypeId,
      FansNumberId,
      rgb,
      description,
      stock,
      dicountPrice,
      categoryId,       // ✅ needed for relation
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    // ✅ generate slug for Product
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const product = await prismadb.cooling.create({
      data: {
        CPUSupportId,
        CoolingMarkId,
        CoolingTypeId,
        FansNumberId,
        Rgb: rgb,
        product: {
          create: {
            slug,                       // ✅ required by Product model
            name,
            price: price,
            isFeatured: isFeatured,
            isArchived: isArchived,
            comingSoon,                 // ✅ keep flags
            outOfStock,
            description: description,
            stock: stock,
            dicountPrice: dicountPrice,
            // ✅ use relation instead of raw categoryId
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
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request) {
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
      cooling: {
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
        case 'Les plus récents':
          orderByClause = {
            createdAt: 'asc',
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
      ) as checkItemGroupsCooling;

      const cpuFilters = [];

      const chipsetFilter = decodedFilterList.coolingMark;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
          CoolingMark: {
            name: {
              in: decodedFilterList.coolingMark.map(item => item.searchKey),
            },
          },
        });
      }

      const motherboardcpusupportFilter = decodedFilterList.coolingType;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        cpuFilters.push({
          CoolingType: {
            name: {
              in: decodedFilterList.coolingType.map(item => item.searchKey),
            },
          },
        });
      }

      const pCcaseNumberofFansPreinstalled = decodedFilterList.coolingcPUSupport;
      if (pCcaseNumberofFansPreinstalled && pCcaseNumberofFansPreinstalled.length > 0) {
        cpuFilters.push({
          numberofFansPreinstalled: {
            number: {
              in: decodedFilterList.coolingcPUSupport.map(item => item.searchKey),
            },
          },
        });
      }

      const pCcaseRGBType = decodedFilterList.fansNumber;
      if (pCcaseRGBType && pCcaseRGBType.length > 0) {
        cpuFilters.push({
          FansNumber: {
            name: {
              in: decodedFilterList.fansNumber.map(item => parseInt(item.searchKey)),
            },
          },
        });
      }

      if (maxDt.length > 0 && maxDt.length) {
        whereClause.price = {
          lte: parseInt(maxDt),
        };
        if (minDt.length > 0 && minDt.length) {
          whereClause.price = {
            ...(whereClause.price || {}),
            gte: parseInt(minDt),
          };
        }
      }

      if (cpuFilters.length > 0) {
        whereClause.cooling = {
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
                equals: motherboardId
              }
            }
          }
        },
        include: {
          coolings: true
        }
      });

      if (prossa.length > 0) {
        whereClause.id = {
          in: prossa
            .flatMap((e) => e.coolings.map((ee) => ee.productId))
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

    return NextResponse.json({ data: products, total });
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
