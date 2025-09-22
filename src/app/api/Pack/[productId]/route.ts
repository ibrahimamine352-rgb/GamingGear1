import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";
import { id } from "date-fns/locale";

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
        additionalDetails: true,
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


    const Product = await prismadb.product.delete({
      where: {
        id:params.productId},
        include:{
          PackProduct:true
        }
    });
    const deletedProduct = await prismadb.accessoryPack.delete({
      where: {
      id:Product.PackProduct[0].id
      }
    });

  
    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { productId: string} }
) {
  try {
    const body = await req.json();

    // Extract necessary information from the request body
    const {prodid,
      packid,
      
      name, price, categoryId, images, isFeatured, isArchived, description, stock,
      Clavier,
      Mouse,
      MousePad,
      Mic,
      Headset,
      Camera,
      Screen,
      Speaker,
      Manette,
      Chair,
      discountOnPack,
      DefaultClavier,
      DefaultMouse,
      DefaultMousePad,
      dicountPrice,
      DefaultMic,
      DefaultHeadset,
      DefaultCamera,
      DefaultScreen,
      DefaultSpeaker,
      DefaultManette,
      DefaultChair,
      additionalDetails
    } = body;

    await prismadb.image.deleteMany({
      where:{
        productId:prodid
      }
    })
     await prismadb.product.update({
      where:{
        id:prodid
      },
      data:{
        name,
        price: price,
        isFeatured: isFeatured,
        isArchived: isArchived,
        description: description,
        categoryId: categoryId,
        stock: stock,
        dicountPrice: dicountPrice,
        additionalDetails: {
          createMany: {
            data: [...additionalDetails]
          }

        },
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({
              url: image.url,
            })),
          }

        },

      }
     })
    const product = await prismadb.accessoryPack.update({
      where:{
        id:packid
      },
      data: {
       
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
        discountOnPack,
        Clavier: {
          connect: Clavier.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        Camera: {
          connect: Camera.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        Chair: {
          connect: Chair.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        Headset: {
          connect: Headset.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        Manette: {
          connect: Manette.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        Mouse: {
          connect: Mouse.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        MousePad: {
          connect: MousePad.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        Screen: {
          connect: Screen.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        Mic: {
          connect: Mic.map((pcCase: any) => ({
            id: pcCase.id
          })),
        },
        Speaker: {
          connect: Speaker.map((pcCase: any) => ({
            id:pcCase.id
          })),},


      }

    })
    console.log(product)
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_PUT]', error);
    return new NextResponse("Internal error " + error, { status: 500 });
  }
};
