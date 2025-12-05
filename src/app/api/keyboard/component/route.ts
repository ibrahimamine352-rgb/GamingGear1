import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
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
      categoryId,
      images,
      isFeatured,
      isArchived,
      comingSoon,
      outOfStock,
      manufacturerId,
      keyboarFormatId,
      keyboarTouchTypeId,
      wireless,
      rgb,
      description,
      stock,
      dicountPrice,
      additionalDetails,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (price === undefined || price === null) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (stock === undefined || stock === null) {
      return new NextResponse("Stock is required", { status: 400 });
    }

    // ✅ generate slug for SEO-friendly URLs
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const keyboard = await prismadb.keyboard.create({
      data: {
        manufacturerId,
        rgb,
        wireless,
        keyboarFormatId,
        keyboarTouchTypeId,
        product: {
          create: {
            slug, // ✅ required by Product model now
            name,
            price,
            isFeatured,
            isArchived,
            comingSoon,
            outOfStock,
            description,
            stock,
            dicountPrice: dicountPrice ?? 0,
            // ✅ connect category relation instead of raw categoryId
            category: {
              connect: { id: categoryId },
            },
            additionalDetails: additionalDetails
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

    return NextResponse.json(keyboard);
  } catch (error) {
    console.log('[MOTHERBOARD_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    const products = await prismadb.product.findMany({
      where: {
        categoryId,
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
    return new NextResponse("Internal error", { status: 500 });
  }
}
