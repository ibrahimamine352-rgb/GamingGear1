import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { slugify } from "@/lib/slugify";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      // Product fields
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
      dicountPrice,
      additionalDetails,

      // RAM fields (Memory)
      marqueId,
      numberId,
      typeId,
      frequencyId,
      rgb,
    } = body;

    // ---------- Validations ----------
    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!images || !Array.isArray(images) || images.length === 0) {
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

    // RAM required fields
    if (!marqueId) return new NextResponse("Marque id is required", { status: 400 });
    if (!numberId) return new NextResponse("Number id is required", { status: 400 });
    if (!typeId) return new NextResponse("Type id is required", { status: 400 });
    if (!frequencyId) return new NextResponse("Frequency id is required", { status: 400 });

    // ---------- Slug ----------
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    // ✅ Create Product + nested Memory (RAM)
    const product = await prismadb.product.create({
      data: {
        slug,
        name,
        price,
        isFeatured: !!isFeatured,
        isArchived: !!isArchived,
        comingSoon: !!comingSoon,
        outOfStock: !!outOfStock,
        description,
        stock,
        dicountPrice: dicountPrice ?? 0,

        category: {
          connect: { id: categoryId },
        },

        // ✅ This matches your app (Product has `memories`)
        memories: {
          create: {
            marqueId,
            numberId,
            typeId,
            frequencyId,
            rgb: !!rgb,
          },
        },

        additionalDetails:
          Array.isArray(additionalDetails) && additionalDetails.length
            ? {
                createMany: {
                  data: additionalDetails,
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
      include: {
        images: true,
        category: true,
        memories: true,
        additionalDetails: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[MEMORY_PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

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
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
