import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Define the filter type locally (do NOT import from a client component)
type CheckItem = { id: number; searchKey: string };
type CheckItemGroups = {
  motherboardchipset: CheckItem[];
  motherboardcpusupport: CheckItem[];
  motherboardformat: CheckItem[];
  motherboardmanufacturer: CheckItem[];
  motherboardramslots: CheckItem[];
};

/* =========================
   CREATE (optional, unchanged in spirit but cleaned)
   ========================= */
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
      chipsetId,
      cpusupportId,
      formatId,
      manufacturerId,
      ramslotsId,
      description,
      stock,
      dicountPrice,
      additionalDetails,
    } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!images?.length) return new NextResponse("Images are required", { status: 400 });
    if (price == null) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
    if (!chipsetId) return new NextResponse("chipsetId is required", { status: 400 });
    if (!cpusupportId) return new NextResponse("cpusupportId is required", { status: 400 });
    if (!formatId) return new NextResponse("formatId is required", { status: 400 });
    if (!ramslotsId) return new NextResponse("ramslotsId is required", { status: 400 });
    if (stock == null) return new NextResponse("stock is required", { status: 400 });

    const motherboard = await prismadb.motherboard.create({
      data: {
        chipsetId,
        cpusupportId,
        formatId,
        manufacturerId,
        ramslotsId,
        products: {
          create: {
            name,
            price,
            isFeatured: !!isFeatured,
            isArchived: !!isArchived,
            comingSoon,     // include it
            outOfStock,
            description,
            categoryId,
            stock,
            dicountPrice,
            additionalDetails: additionalDetails?.length
              ? { createMany: { data: additionalDetails } }
              : undefined,
            images: {
              createMany: {
                data: images.map((img: { url: string }) => ({ url: img.url })),
              },
            },
          },
        },
      },
    });

    return NextResponse.json(motherboard);
  } catch (error) {
    console.error("[MOTHERBOARD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/* =========================
   READ (used by your modal)
   ========================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") ?? "0", 10);
    const units = parseInt(searchParams.get("units") ?? "10", 10);
    const q = (searchParams.get("q") ?? "").trim();
    const sort = decodeURIComponent(searchParams.get("sort") ?? "Prix : Croissant");
    const maxDt = searchParams.get("maxDt") ?? "";
    const minDt = searchParams.get("minDt") ?? "";
    const cpuId = searchParams.get("cpuId") ?? "";
    const isFeatured = searchParams.get("isFeatured");

    const where: Record<string, any> = {
      isArchived: false,
      // ensure only products that HAVE a motherboard row
      motherboard: { some: {} },
    };

    // optional featured flag
    if (isFeatured && !["0", "false", "off"].includes(isFeatured.toLowerCase())) {
      where.isFeatured = true;
    }

    // search by words (case-insensitive)
    if (q) {
      const words = q.split(/\s+/).filter(Boolean);
      if (words.length) {
        where.AND = words.map((w) => ({ name: { contains: w, mode: "insensitive" } }));
      } else {
        where.name = { contains: q, mode: "insensitive" };
      }
    }

    // price range
    if (maxDt) {
      where.price = { lte: parseInt(maxDt, 10) };
      if (minDt) where.price.gte = parseInt(minDt, 10);
    }

    // filters sent from UI
    const filterListParam = searchParams.get("filterList");
    if (filterListParam) {
      try {
        const fl: CheckItemGroups = JSON.parse(decodeURIComponent(filterListParam));

        const mbFilters: any[] = [];

        if (fl.motherboardchipset?.length) {
          mbFilters.push({
            chipset: { name: { in: fl.motherboardchipset.map((i) => i.searchKey) } },
          });
        }
        if (fl.motherboardcpusupport?.length) {
          mbFilters.push({
            cpusupport: { name: { in: fl.motherboardcpusupport.map((i) => i.searchKey) } },
          });
        }
        if (fl.motherboardformat?.length) {
          mbFilters.push({
            format: { name: { in: fl.motherboardformat.map((i) => i.searchKey) } },
          });
        }
        if (fl.motherboardmanufacturer?.length) {
          mbFilters.push({
            manufacturer: { name: { in: fl.motherboardmanufacturer.map((i) => i.searchKey) } },
          });
        }
        if (fl.motherboardramslots?.length) {
          mbFilters.push({
            ramslots: { name: { in: fl.motherboardramslots.map((i) => i.searchKey) } },
          });
        }

        if (mbFilters.length) {
          where.motherboard = { some: { AND: mbFilters } };
        }
      } catch {
        // ignore malformed filters
      }
    }

    // optional CPU compatibility narrowing
    if (cpuId) {
      const profiles = await prismadb.compatibiltyProfile.findMany({
        where: {
          CPUs: { some: { productId: cpuId } },
        },
        include: { motherboards: true },
      });

      if (profiles.length) {
        const ids = profiles
          .flatMap((p) => p.motherboards.map((m) => m.productId))
          .filter(Boolean);

        if (ids.length) where.id = { in: ids };
      }
    }

    // sort (unique cases; removed duplicated “Les plus récents”)
    let orderBy: Record<string, "asc" | "desc"> = { price: "asc" };
    switch (sort) {
      case "Les plus populaires":
        orderBy = { soldnumber: "desc" };
        break;
      case "Les plus récents":
        orderBy = { createdAt: "desc" };
        break;
      case "Prix : Croissant":
        orderBy = { price: "asc" };
        break;
      case "Prix : Décroissant":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { price: "asc" };
    }

    const data = await prismadb.product.findMany({
      where,
      include: {
        images: true,
        motherboard: true,
        category: true,
      },
      orderBy,
      take: units,
      skip: page * units,
    });

    const total = await prismadb.product.count({ where });

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("[MOTHERBOARD_GET]", error);
    return NextResponse.json({ data: [], total: 0 }, { status: 500 });
  }
}
