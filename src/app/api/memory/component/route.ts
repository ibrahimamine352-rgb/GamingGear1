import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { slugify } from "@/lib/slugify";

// If you use these strings in the UI, keep them consistent here
const SORT = {
  MOST_POPULAR: "Les plus populaires",
  MOST_RECENT: "Les plus récents",
  PRICE_ASC: "Prix : Croissant",
  PRICE_DESC: "Prix : Décroissant",
} as const;

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

    if (!marqueId) return new NextResponse("Marque id is required", { status: 400 });
    if (!numberId) return new NextResponse("Number id is required", { status: 400 });
    if (!typeId) return new NextResponse("Type id is required", { status: 400 });
    if (!frequencyId) return new NextResponse("Frequency id is required", { status: 400 });

    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

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

        category: { connect: { id: categoryId } },

        // Product.memories is Product[] <-> Memory[] in your schema
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
            ? { createMany: { data: additionalDetails } }
            : undefined,

        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({ url: image.url })),
          },
        },
      },
      include: {
        images: true,
        category: true,
        memories: {
          include: {
            marque: true,
            number: true,
            type: true,
            frequency: true,
          },
        },
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

    // Build-PC / Shop typically sends these
    const search = searchParams.get("search")?.trim() || "";
    const minDt = Number(searchParams.get("minDt") ?? 0);
    const maxDt = Number(searchParams.get("maxDt") ?? 999999999);

    // pagination (make page 1-based)
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const perpage = Math.max(1, Number(searchParams.get("perpage") ?? 24));
    const skip = (page - 1) * perpage;
    const take = perpage;

    // optional flags
    const isFeatured = searchParams.get("isFeatured");
    const categoryId = searchParams.get("categoryId") || undefined;

    // If your UI sends category name as `categorie=Monitors`, support it too:
    const categorieName = searchParams.get("categorie") || undefined;
    let resolvedCategoryId = categoryId;

    if (!resolvedCategoryId && categorieName) {
      const cat = await prismadb.category.findFirst({
        where: { name: categorieName },
        select: { id: true },
      });
      resolvedCategoryId = cat?.id;
    }

    const sort = searchParams.get("sort") || "";
    const orderBy =
      sort === SORT.MOST_RECENT
        ? { createdAt: "desc" as const }
        : sort === SORT.PRICE_ASC
        ? { price: "asc" as const }
        : sort === SORT.PRICE_DESC
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

    // ✅ IMPORTANT: only RAM products
    const whereClause: any = {
      isArchived: false,
      ...(resolvedCategoryId ? { categoryId: resolvedCategoryId } : {}),
      ...(isFeatured ? { isFeatured: true } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      // price range
      price: {
        gte: isFinite(minDt) ? minDt : 0,
        lte: isFinite(maxDt) ? maxDt : 999999999,
      },
      // 🔥 RAM-only condition
      memories: { some: {} },
    };

    const [total, products] = await Promise.all([
      prismadb.product.count({ where: whereClause }),
      prismadb.product.findMany({
        where: whereClause,
        include: {
          images: true,
          category: true,
          // include RAM details for Build-PC filters
          memories: {
            include: {
              marque: true,
              number: true,
              type: true,
              frequency: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    // Keep returning array (compatible with your old callers)
    return NextResponse.json(products, {
      headers: {
        "X-Total-Count": String(total),
        "X-Page": String(page),
        "X-Per-Page": String(perpage),
      },
    });
  } catch (error) {
    console.log("[MEMORY_COMPONENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
