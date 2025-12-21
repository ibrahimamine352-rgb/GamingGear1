import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { slugify } from "@/lib/slugify";

type PackType = "CUSTOM" | "UNITY_SCREEN";

function toConnectIds(arr: any[] | undefined) {
  return (Array.isArray(arr) ? arr : []).map((i) => ({ id: i.id }));
}

function firstImageUrl(images: { url: string }[] | undefined) {
  return Array.isArray(images) && images.length > 0 ? images[0].url : "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      packType,
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
      dicountPrice = 0,
      additionalDetails = [],
    } = body as {
      packType: PackType;
      name: string;
      price: number;
      categoryId: string;
      images: { url: string }[];
      isFeatured?: boolean;
      isArchived?: boolean;
      comingSoon?: boolean;
      outOfStock?: boolean;
      description: string;
      stock: number;
      dicountPrice?: number;
      additionalDetails?: { name: string; value: string }[];
    };

    if (!packType) return new NextResponse("packType is required", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!description) return new NextResponse("description is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
    if (!images || !Array.isArray(images) || images.length === 0) {
      return new NextResponse("Images are required", { status: 400 });
    }

    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now()}`;

    // ✅ Create Product first
    const createdProduct = await prismadb.product.create({
      data: {
        slug,
        name,
        price,
        dicountPrice: dicountPrice ?? 0,
        description,
        stock,
        isFeatured: !!isFeatured,
        isArchived: !!isArchived,
        comingSoon: !!comingSoon,
        outOfStock: !!outOfStock,
        packType, // ✅ enum matches your schema
        category: { connect: { id: categoryId } },

        additionalDetails:
          Array.isArray(additionalDetails) && additionalDetails.length
            ? { createMany: { data: additionalDetails } }
            : undefined,

        images: {
          createMany: {
            data: images.map((img) => ({ url: img.url })),
          },
        },
      },
    });

    // ✅ CUSTOM => AccessoryPack
    if (packType === "CUSTOM") {
      const {
        discountOnPack = 0,
        DefaultClavier,
        DefaultMouse,
        DefaultMousePad,
        DefaultMic,
        DefaultHeadset,
        DefaultCamera,
        DefaultScreen,
        DefaultSpeaker,
        DefaultManette,
        DefaultChair,

        Clavier = [],
        Mouse = [],
        MousePad = [],
        Mic = [],
        Headset = [],
        Camera = [],
        Screen = [],
        Speaker = [],
        Manette = [],
        Chair = [],
      } = body;

      const accessoryPack = await prismadb.accessoryPack.create({
        data: {
          discountOnPack,
          DefaultCamera,
          DefaultChair,
          DefaultClavier,
          DefaultHeadset,
          DefaultManette,
          DefaultMic,
          DefaultMouse,
          DefaultMousePad,
          DefaultScreen,
          DefaultSpeaker,

          // ✅ Product is Product[] in schema => connect ARRAY
          Product: { connect: [{ id: createdProduct.id }] },

          Clavier: { connect: toConnectIds(Clavier) },
          Mouse: { connect: toConnectIds(Mouse) },
          MousePad: { connect: toConnectIds(MousePad) },
          Mic: { connect: toConnectIds(Mic) },
          Headset: { connect: toConnectIds(Headset) },
          Camera: { connect: toConnectIds(Camera) },
          Screen: { connect: toConnectIds(Screen) },
          Speaker: { connect: toConnectIds(Speaker) },
          Manette: { connect: toConnectIds(Manette) },
          Chair: { connect: toConnectIds(Chair) },
        },
      });

      return NextResponse.json({ product: createdProduct, accessoryPack });
    }

    // ✅ UNITY_SCREEN => FullPack
    if (packType === "UNITY_SCREEN") {
      const {
        discountOnPack = 0,
        DefaultUnity,
        DefaultScreen,
        DefaultPack,
        Unity = [],
        Screen = [],
        Pack = [],
      } = body;

      // Pack[] comes as PRODUCTs -> convert to AccessoryPack ids
      const packProductIds = (Array.isArray(Pack) ? Pack : []).map((p: any) => p.id);

      const accessoryPacks = packProductIds.length
        ? await prismadb.accessoryPack.findMany({
            where: { Product: { some: { id: { in: packProductIds } } } },
            select: { id: true },
          })
        : [];

      const fullPack = await prismadb.fullPack.create({
        data: {
          // ✅ REQUIRED by your schema (no defaults)
          packId: createdProduct.id,
          packTitle: name,
          packImage: firstImageUrl(images),

          Title: name,
          price,
          discountOnPack,
          DefaultUnity: DefaultUnity ?? "",
          DefaultScreen: DefaultScreen ?? "",
          DefaultPack: DefaultPack ?? "",

          // ✅ Product is Product[] in schema => connect ARRAY
          Product: { connect: [{ id: createdProduct.id }] },

          Unity: { connect: toConnectIds(Unity) },
          Screen: { connect: toConnectIds(Screen) },
          Pack: { connect: accessoryPacks.map((p) => ({ id: p.id })) },
        },
      });

      return NextResponse.json({ product: createdProduct, fullPack });
    }

    return new NextResponse("Invalid packType", { status: 400 });
  } catch (error) {
    console.log("[PACK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prismadb.product.findMany({
      where: {
        packType: { in: ["CUSTOM", "UNITY_SCREEN"] },
        isArchived: false,
      },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PACK_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
