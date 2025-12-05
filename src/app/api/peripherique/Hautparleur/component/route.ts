import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { slugify } from "@/lib/slugify";

// --------------------- POST -----------------------
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
      manufacturerId,
      RgbTypeId,
      SonsurroundId,
      dicountPrice = 0,
    } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!images?.length) return new NextResponse("Images are required", { status: 400 });
    if (price == null) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
    if (stock == null) return new NextResponse("Stock is required", { status: 400 });

    // --------------------- SLUG -----------------------
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    // --------------------- CREATE SPEAKER -----------------------
    const product = await prismadb.hautparleur.create({
      data: {
        manufacturerId,
        RgbTypeId,
        SonsurroundId,

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

            category: { connect: { id: categoryId } },

            images: {
              createMany: {
                data: images.map((img: { url: string }) => ({ url: img.url })),
              },
            },

            additionalDetails: additionalDetails.length
              ? { createMany: { data: additionalDetails } }
              : undefined,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[SPEAKER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// --------------------- GET -----------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "0");
    const units = parseInt(searchParams.get("units") || "14");
    const q = searchParams.get("q") || "";
    const isFeatured = searchParams.get("isFeatured");
    const sort = searchParams.get("sort") || "";
    const maxDt = searchParams.get("maxDt") || "";
    const minDt = searchParams.get("minDt") || "";

    // --------------------- WHERE CLAUSE -----------------------
    const where: any = {
      isArchived: false,
      hautparleur: { some: {} }, // Get only speaker products
    };

    if (q.length > 0) {
      where.name = { contains: q, mode: "insensitive" };
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    if (maxDt) {
      where.price = { lte: parseInt(maxDt) };
      if (minDt) where.price.gte = parseInt(minDt);
    }

    // --------------------- SORT CLAUSE -----------------------
    let orderBy: any = { createdAt: "desc" };

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

    // --------------------- QUERY PRODUCTS -----------------------
    const data = await prismadb.product.findMany({
      where,
      include: { images: true, Hautparleur: true },
      orderBy,
      take: units,
      skip: page * units,
    });

    const total = await prismadb.product.count({ where });

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("[SPEAKER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
