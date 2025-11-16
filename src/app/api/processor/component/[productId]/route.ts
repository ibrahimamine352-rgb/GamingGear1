import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// ============ GET /api/processor/component/[productId] ============
export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        cpus: { include: { processorModel: true, cpusupport: true } }, // <-- helpful for UI
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// ============ DELETE /api/processor/component/[productId] ============
export async function DELETE(
  _req: Request,
  { params }: { params: { productId: string; storeId?: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.delete({
      where: { id: params.productId },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// ============ PATCH /api/processor/component/[productId] ============
// Updates ONE product and its OWN CPU link. Never mass-update CPUs.
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
      processorModelId, // from form
      cpusupportId,     // from form
      additionalDetails, // if you send this from your form
    } = body;

    if (!params.productId)
      return new NextResponse("Product id is required", { status: 400 });
    if (!name)
      return new NextResponse("Name is required", { status: 400 });
    if (!images?.length)
      return new NextResponse("Images are required", { status: 400 });
    if (price === undefined || price === null)
      return new NextResponse("Price is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category id is required", { status: 400 });

    // 1) Update product core fields and images (replace all images)
    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        isFeatured: !!isFeatured,
        isArchived: !!isArchived,
        comingSoon: !!comingSoon,
        outOfStock: !!outOfStock,
        description,
        stock,
        dicountPrice,

        images: {
          deleteMany: {}, // wipe old images
          createMany: {
            data: images.map((img: { url: string }) => ({ url: img.url })),
          },
        },

        // If you want to fully replace extra details when provided:
        ...(Array.isArray(additionalDetails)
          ? {
              additionalDetails: {
                deleteMany: {},
                createMany: {
                  data: additionalDetails.map(
                    (d: { name: string; value: string }) => ({
                      name: d.name,
                      value: d.value,
                    })
                  ),
                },
              },
            }
          : {}),
      },
    });

    // 2) Update or create the CPU row linked to THIS product only
    if (processorModelId && cpusupportId) {
      // Find existing CPU linked to this product
      const existing = await prismadb.product.findUnique({
        where: { id: params.productId },
        include: { cpus: true },
      });

      const currentCpu = existing?.cpus?.[0];

      if (currentCpu) {
        // Update just that CPU (NOT all CPUs!)
        await prismadb.processor.update({
          where: { id: currentCpu.id },
          data: {
            processorModel: { connect: { id: processorModelId } },
            cpusupport: { connect: { id: cpusupportId } },
          },
        });
      } else {
        // No CPU linked yet: create a new one and set it on the product
        const newCpu = await prismadb.processor.create({
          data: {
            processorModel: { connect: { id: processorModelId } },
            cpusupport: { connect: { id: cpusupportId } },
          },
        });

        await prismadb.product.update({
          where: { id: params.productId },
          data: {
            cpus: {
              set: [{ id: newCpu.id }], // ensure only this one is linked
            },
          },
        });
      }
    }

    // 3) Return updated product with relations
    const updated = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        cpus: { include: { processorModel: true, cpusupport: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.log("[PROCESSOR_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
