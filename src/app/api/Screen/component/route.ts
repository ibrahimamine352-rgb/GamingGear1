import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import type { CheckItemGroupsScreen } from '@/app/(storefront)/build-pc/_componenets/Screen';
import { slugify } from '@/lib/slugify';

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
      additionalDetails,
      resolutionId,
      PouceId,
      RefreshRateId,
      curved,
      markId,
    } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
    }

    if (price === undefined || price === null) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    if (stock === undefined || stock === null) {
      return new NextResponse('Stock is required', { status: 400 });
    }

    // SEO slug for Product
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const product = await prismadb.screen.create({
      data: {
        MarkId: markId,
        resolutionId,
        curved,
        RefreshRateId,
        PouceId,
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
            additionalDetails: additionalDetails?.length
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
          orderByClause = { price: 'desc' };
          break;
        case 'Prix : Croissant':
          orderByClause = { price: 'asc' };
          break;
        case 'Prix : Décroissant':
          orderByClause = { price: 'desc' };
          break;
        default:
          orderByClause = { price: 'asc' };
      }
    } else {
      orderByClause = { price: 'asc' };
    }

    const filterListParam = searchParams.get('filterList');

    if (filterListParam) {
      const decodedFilterList = JSON.parse(
        decodeURIComponent(filterListParam)
      ) as CheckItemGroupsScreen; // ✅ correct type name

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
