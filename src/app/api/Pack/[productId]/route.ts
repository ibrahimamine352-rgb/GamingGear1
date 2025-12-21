import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

type PackType = "CUSTOM" | "UNITY_SCREEN";

function toConnectIds(arr: any[] | undefined) {
  return (Array.isArray(arr) ? arr : []).map((i) => ({ id: i.id }));
}

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) return new NextResponse("Product id is required", { status: 400 });

    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        additionalDetails: true,

        // Custom pack relation
        PackProduct: {
          include: {
            Camera: true,
            Chair: true,
            Clavier: true,
            Headset: true,
            Manette: true,
            Mic: true,
            Mouse: true,
            MousePad: true,
            Screen: true,
            Speaker: true,
            Product: true,
          },
        },

        // UnityScreen pack relation
        FullPack: {
          include: {
            Unity: { include: { images: true } },
            Screen: { include: { images: true } },
            Pack: { include: { Product: { include: { images: true } } } },
            Product: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PACK_GET_ONE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) return new NextResponse("Product id is required", { status: 400 });

    const body = await req.json();

    const {
      packType,
      name,
      price,
      categoryId,
      images = [],
      isFeatured,
      isArchived,
      comingSoon,
      outOfStock,
      description,
      stock,
      dicountPrice = 0,
      additionalDetails = [],
    } = body as any;

    const existing = await prismadb.product.findUnique({
      where: { id: params.productId },
      select: { packType: true },
    });

    const finalPackType = (packType ?? existing?.packType ?? null) as PackType | null;
    if (!finalPackType) return new NextResponse("packType missing on product", { status: 400 });

    // reset images/details
    await prismadb.image.deleteMany({ where: { productId: params.productId } });
    await prismadb.field.deleteMany({ where: { productId: params.productId } });

    // update Product
    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        dicountPrice,
        description,
        stock,
        isFeatured: !!isFeatured,
        isArchived: !!isArchived,
        comingSoon: !!comingSoon,
        outOfStock: !!outOfStock,
        packType: finalPackType,
        category: { connect: { id: categoryId } },
        additionalDetails:
          Array.isArray(additionalDetails) && additionalDetails.length
            ? { createMany: { data: additionalDetails } }
            : undefined,
        images: {
          createMany: {
            data: (Array.isArray(images) ? images : []).map((img: any) => ({ url: img.url })),
          },
        },
      },
    });

    // CUSTOM update
    if (finalPackType === "CUSTOM") {
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

      const packRow = await prismadb.accessoryPack.findFirst({
        where: { Product: { some: { id: params.productId } } },
        select: { id: true },
      });

      if (!packRow?.id) return new NextResponse("AccessoryPack row not found", { status: 404 });

      const updated = await prismadb.accessoryPack.update({
        where: { id: packRow.id },
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

      return NextResponse.json(updated);
    }

    // UNITY_SCREEN update
    if (finalPackType === "UNITY_SCREEN") {
      const {
        discountOnPack = 0,
        DefaultUnity,
        DefaultScreen,
        DefaultPack,
        Unity = [],
        Screen = [],
        Pack = [],
      } = body;

      const fullPackRow = await prismadb.fullPack.findFirst({
        where: { Product: { some: { id: params.productId } } },
        select: { id: true },
      });

      if (!fullPackRow?.id) return new NextResponse("FullPack row not found", { status: 404 });

      const packProductIds = (Array.isArray(Pack) ? Pack : []).map((p: any) => p.id);

      const accessoryPacks = packProductIds.length
        ? await prismadb.accessoryPack.findMany({
            where: { Product: { some: { id: { in: packProductIds } } } },
            select: { id: true },
          })
        : [];

      const updated = await prismadb.fullPack.update({
        where: { id: fullPackRow.id },
        data: {
          Title: name,
          price,
          discountOnPack,
          DefaultUnity: DefaultUnity ?? "",
          DefaultScreen: DefaultScreen ?? "",
          DefaultPack: DefaultPack ?? "",
          Unity: { set: [], connect: toConnectIds(Unity) },
          Screen: { set: [], connect: toConnectIds(Screen) },
          Pack: { set: [], connect: accessoryPacks.map((p) => ({ id: p.id })) },
        },
      });

      return NextResponse.json(updated);
    }

    return new NextResponse("Invalid packType", { status: 400 });
  } catch (error) {
    console.log("[PACK_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
