import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { slugify } from "@/lib/slugify";

type PackType = "CUSTOM" | "UNITY_SCREEN";

const toConnectIds = (arr: any[] | undefined) =>
  (Array.isArray(arr) ? arr : []).map((i) => ({ id: i.id }));

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        additionalDetails: true,
        PackProduct: {
          include: {
            Camera: { include: { images: true } },
            Clavier: { include: { images: true } },
            Headset: { include: { images: true } },
            Mic: { include: { images: true } },
            Mouse: { include: { images: true } },
            MousePad: { include: { images: true } },
            Screen: { include: { images: true } },
            Chair: { include: { images: true } },
            Manette: { include: { images: true } },
            Speaker: { include: { images: true } },
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PACK_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
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
      dicountPrice,
      additionalDetails,
    } = body as {
      packType?: PackType;
      name?: string;
      price?: number;
      categoryId?: string;
      images?: { url: string }[];
      isFeatured?: boolean;
      isArchived?: boolean;
      comingSoon?: boolean;
      outOfStock?: boolean;
      description?: string;
      stock?: number;
      dicountPrice?: number;
      additionalDetails?: { name: string; value: string }[];
    };

    /**
     * ✅ IMPORTANT FIX:
     * Don't use `select: { packType: true }` (it breaks types for some Prisma builds).
     * Fetch the product normally and read `existing?.packType`.
     */
    const existing = await prismadb.product.findUnique({
      where: { id: params.productId },
    });

    const finalPackType: PackType | null =
      (packType ?? (existing?.packType as PackType | undefined) ?? null);

    if (!finalPackType) {
      return new NextResponse("packType is required", { status: 400 });
    }

    const updated = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        ...(typeof name === "string" && name.length
          ? { name, slug: `${slugify(name)}-${Date.now()}` }
          : {}),

        ...(typeof price === "number" ? { price } : {}),
        ...(typeof dicountPrice === "number" ? { dicountPrice } : {}),
        ...(typeof stock === "number" ? { stock } : {}),
        ...(typeof description === "string" ? { description } : {}),

        ...(typeof categoryId === "string" && categoryId.length
          ? { category: { connect: { id: categoryId } } }
          : {}),

        ...(typeof isFeatured === "boolean" ? { isFeatured } : {}),
        ...(typeof isArchived === "boolean" ? { isArchived } : {}),
        ...(typeof comingSoon === "boolean" ? { comingSoon } : {}),
        ...(typeof outOfStock === "boolean" ? { outOfStock } : {}),

        packType: finalPackType,

        ...(Array.isArray(additionalDetails)
          ? {
              additionalDetails: {
                deleteMany: {},
                createMany: { data: additionalDetails },
              },
            }
          : {}),

        ...(Array.isArray(images)
          ? {
              images: {
                deleteMany: {},
                createMany: { data: images.map((i) => ({ url: i.url })) },
              },
            }
          : {}),
      },
    });

    // ✅ CUSTOM: update AccessoryPack relations
    if (finalPackType === "CUSTOM") {
      const {
        discountOnPack = 0,
        DefaultClavier = "",
        DefaultMouse = "",
        DefaultMousePad = "",
        DefaultMic = "",
        DefaultHeadset = "",
        DefaultCamera = "",
        DefaultScreen = "",
        DefaultSpeaker = "",
        DefaultManette = "",
        DefaultChair = "",
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
      } = body as any;

      const pack = await prismadb.accessoryPack.findFirst({
        where: { Product: { some: { id: params.productId } } },
        select: { id: true },
      });

      if (pack) {
        await prismadb.accessoryPack.update({
          where: { id: pack.id },
          data: {
            discountOnPack: Number(discountOnPack) || 0,

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

            Clavier: { set: [], connect: toConnectIds(Clavier) },
            Mouse: { set: [], connect: toConnectIds(Mouse) },
            MousePad: { set: [], connect: toConnectIds(MousePad) },
            Mic: { set: [], connect: toConnectIds(Mic) },
            Headset: { set: [], connect: toConnectIds(Headset) },
            Camera: { set: [], connect: toConnectIds(Camera) },
            Screen: { set: [], connect: toConnectIds(Screen) },
            Speaker: { set: [], connect: toConnectIds(Speaker) },
            Manette: { set: [], connect: toConnectIds(Manette) },
            Chair: { set: [], connect: toConnectIds(Chair) },
          },
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.log("[PACK_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const deleted = await prismadb.product.delete({
      where: { id: params.productId },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.log("[PACK_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
