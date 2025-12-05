import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { slugify } from '@/lib/slugify';

export async function POST(
  req: Request,
  {}: {}
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
    } = body;

    if (!additionalDetails || !additionalDetails.length) {
      return new NextResponse('additionalDetails is required', { status: 400 });
    }
    if (!description) {
      return new NextResponse('description is required', { status: 400 });
    }
    if (stock === undefined || stock === null) {
      return new NextResponse('stock is required', { status: 400 });
    }
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

    // SEO slug
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const product = await prismadb.product.create({
      data: {
        slug,
        stock,
        name,
        price,
        isFeatured,
        isArchived,
        comingSoon,
        outOfStock,
        description,
        // connect to Category relation
        category: {
          connect: { id: categoryId },
        },
        additionalDetails: {
          createMany: {
            data: [...additionalDetails],
          },
        },
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({
              url: image.url,
            })),
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error ' + error, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    const products = await prismadb.product.findMany({
      where: {
        ...(categoryId
          ? {
              category: {
                id: categoryId,
              },
            }
          : {}),
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
