import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { checkItemGroupsCooling } from "@/app/(storefront)/build-pc/_componenets/Cooling";
import { slugify } from "@/lib/slugify";

export async function POST(req: Request) {
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
      categoryId,
    } = body;

    // ---------- Validations ----------
    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new NextResponse("Images are required", { status: 400 });
    }

    // ✅ fixes: allow price = 0
    if (price === undefined || price === null) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    // If these are required in your schema, keep them:
    if (!CPUSupportId) return new NextResponse("CPUSupportId is required", { status: 400 });
    if (!CoolingMarkId) return new NextResponse("CoolingMarkId is required", { status: 400 });
    if (!CoolingTypeId) return new NextResponse("CoolingTypeId is required", { status: 400 });
    if (!FansNumberId) return new NextResponse("FansNumberId is required", { status: 400 });

    // ---------- Slug ----------
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    // ✅ Correct: Create Product first, then nested Cooler under product.cooling
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

        // ✅ matches your GET query: cooling: { some:{} }
        cooling: {
          create: {
            CPUSupportId,
            CoolingMarkId,
            CoolingTypeId,
            FansNumberId,
            Rgb: !!rgb,
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
      include: {
        images: true,
        category: true,
        cooling: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[COOLING_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url || "", "http://localhost");

    const page = parseInt(searchParams.get("page") || "0", 10);
    const units = parseInt(searchParams.get("units") || "14", 10) || 14;
    const q = searchParams.get("q") || "";
    const isFeatured = searchParams.get("isFeatured");
    const sort = searchParams.get("sort") || "";
    const maxDt = searchParams.get("maxDt") || "";
    const minDt = searchParams.get("minDt") || "";
    const motherboardId = searchParams.get("motherboardId") || "";

    const whereClause: Record<string, any> = {
      isArchived: false,
      cooling: {
        some: {},
      },
    };

    if (q) {
      whereClause.name = {
        contains: q,
        mode: "insensitive",
      };
    }

    if (isFeatured) {
      whereClause.isFeatured = true;
    }

    // ---------- Sorting ----------
    let orderByClause: Record<string, "asc" | "desc"> = { price: "asc" };

    if (sort && sort.length > 0) {
      switch (sort) {
        case "Les plus populaires":
          orderByClause = { soldnumber: "desc" };
          break;
        case "Les plus récents":
          orderByClause = { createdAt: "desc" }; // ✅ fixed duplicate
          break;
        case "Prix : Croissant":
          orderByClause = { price: "asc" };
          break;
        case "Prix : Décroissant":
          orderByClause = { price: "desc" };
          break;
        default:
          orderByClause = { price: "asc" };
      }
    }

    // ---------- Filters ----------
    const filterListParam = searchParams.get("filterList");

    if (filterListParam) {
      const decodedFilterList = JSON.parse(
        decodeURIComponent(filterListParam)
      ) as checkItemGroupsCooling;

      const cpuFilters: any[] = [];

      // coolingMark
      if (decodedFilterList.coolingMark?.length) {
        cpuFilters.push({
          CoolingMark: {
            name: {
              in: decodedFilterList.coolingMark.map((item) => item.searchKey),
            },
          },
        });
      }

      // coolingType
      if (decodedFilterList.coolingType?.length) {
        cpuFilters.push({
          CoolingType: {
            name: {
              in: decodedFilterList.coolingType.map((item) => item.searchKey),
            },
          },
        });
      }

      // CPU support (this was wrong in your code)
      if (decodedFilterList.coolingcPUSupport?.length) {
        cpuFilters.push({
          CPUSupport: {
            name: {
              in: decodedFilterList.coolingcPUSupport.map((item) => item.searchKey),
            },
          },
        });
      }

      // fansNumber
      if (decodedFilterList.fansNumber?.length) {
        cpuFilters.push({
          FansNumber: {
            name: {
              in: decodedFilterList.fansNumber.map((item) => item.searchKey),
            },
          },
        });
      }

      // Price range
      if (maxDt) {
        whereClause.price = { lte: parseInt(maxDt, 10) };
      }
      if (minDt) {
        whereClause.price = { ...(whereClause.price || {}), gte: parseInt(minDt, 10) };
      }

      if (cpuFilters.length > 0) {
        whereClause.cooling = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    }

    // ---------- Compatibility profile filter ----------
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
          coolings: true,
        },
      });

      if (prossa.length > 0) {
        whereClause.id = {
          in: prossa
            .flatMap((e) => e.coolings.map((ee) => ee.productId))
            .filter((productId) => productId !== undefined),
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
    console.error("[COOLING_PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
