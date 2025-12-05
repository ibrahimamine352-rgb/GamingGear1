import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { slugify } from "@/lib/slugify";

// ---------------------- POST ----------------------
export async function POST(req: Request) {
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
      Connectiviteid,
      manufacturerId,
      RgbTypeId,
      dicountPrice = 0,
    } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!images?.length) return new NextResponse("Images are required", { status: 400 });
    if (price == null) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
    if (stock == null) return new NextResponse("Stock is required", { status: 400 });

    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const manette = await prismadb.manette.create({
      data: {
        Connectiviteid,
        manufacturerId,
        RgbTypeId,
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

            images: {
              createMany: {
                data: images.map((img: { url: string }) => ({ url: img.url })),
              },
            },

            additionalDetails: additionalDetails.length
              ? {
                  createMany: {
                    data: additionalDetails,
                  },
                }
              : undefined,
          },
        },
      },
    });

    return NextResponse.json(manette);
  } catch (error) {
    console.error("[MANETTE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// ---------------------- GET ----------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "0", 10);
    const units = parseInt(searchParams.get("units") || "14", 10);
    const q = searchParams.get("q") || "";
    const isFeatured = searchParams.get("isFeatured");
    const sort = searchParams.get("sort") || "";
    const maxDt = searchParams.get("maxDt") || "";
    const minDt = searchParams.get("minDt") || "";

    const where: any = {
      isArchived: false,
      manette: { some: {} }, // products that are manettes
    };

    if (q) {
      where.name = {
        contains: q,
        mode: "insensitive",
      };
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    if (maxDt) {
      where.price = { lte: parseInt(maxDt, 10) };
      if (minDt) {
        where.price.gte = parseInt(minDt, 10);
      }
    }

    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };

    switch (sort) {
      case "Les plus populaires":
        orderBy = { soldnumber: "desc" };
        break;
      case "Prix : Croissant":
        orderBy = { price: "asc" };
        break;
      case "Prix : Décroissant":
        orderBy = { price: "desc" };
        break;
      case "Les plus récents":
        orderBy = { createdAt: "desc" };
        break;
    }

    const data = await prismadb.product.findMany({
      where,
      include: {
        images: true,
        Manette: true,
      },
      orderBy,
      take: units,
      skip: page * units,
    });

    const total = await prismadb.product.count({ where });

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("[MANETTE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
