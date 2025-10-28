import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        images: true,
        category: true,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }



    const product = await prismadb.product.delete({
      where: {
        id: params.productId
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
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
      description,
      stock,
      dicountPrice,
      processorModelId,
      cpusupportId,
    } = body;

    if (!params.productId) return new NextResponse("Product id is required", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!images?.length) return new NextResponse("Images are required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category id is required", { status: 400 });

    // 1) Update the product basics + images
    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        isFeatured,
        isArchived,
        comingSoon,
        outOfStock,
        description,
        stock,
        dicountPrice,
        images: {
          deleteMany: {},
          createMany: { data: images.map((img: { url: string }) => ({ url: img.url })) },
        },
      },
    });

    // 2) Update the related processor selection (ASSUMED 1–1 BY productId)
    await prismadb.processor.updateMany({
      data: {
        // If these are numeric in your Prisma schema, wrap with Number(...)
        processorModelId: processorModelId, 
        cpusupportId: cpusupportId,
      },
    });

    // Return the updated product (and optionally join processor to verify)
    const updated = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: { images: true, category: true, cpus: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.log("[PROCESSOR_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
