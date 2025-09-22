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


    const deletedProduct = await prismadb.preBuiltPcmodel.delete({
      where: {
        productId: params.productId, // Replace with the actual property name used in your database
      },
      include:{
        pcTemplate:true
      }
    
    });
    await prismadb.pcTemplate.delete({
      where: {
        id: deletedProduct.pcTemplate.id, // Replace with the actual property name used in your database
      }
    });
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
  { params }: { params: { productId: string} }
) {
  try {
    const body = await req.json();

    // Extract necessary information from the request body
    const {  
      defaultcaseId,
            defaultgraphicCardId,
            defaulthardDiskArray,
            defaultmotherBoardId,
            defaultpowerSupplyId,
            defaultprocessorId,
            defaultramIdArray,
            discountOnPc,coolings,name, price, categoryId, images, isFeatured, isArchived, description, stock, additionalDetails, caseId, graphicCardId, motherBoardId, powerSupplyId, processorId, hardDiskArray, ramIdArray } = body;

    // Validation checks (similar to the POST function)

    await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        price,
        categoryId,
        additionalDetails:{
          deleteMany: {},
        },
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });
    const updatedProduct = await prismadb.preBuiltPcmodel.update({
      where: {
        productId: params.productId, // Replace with the actual property name used in your database
      },
      data: {
        product: {
          update: {
            name,
            price,
            isFeatured,
            isArchived,
            categoryId,
            description,
            stock,
            additionalDetails: {
              createMany:{
                data: [...additionalDetails]
               }
     
            },
            images: {
              createMany: {
                data: [
                  ...images.map((image: { url: string }) => image),
                ],
              },
            },
          },
        },
        pcTemplate:{
          update:{
            defaultcaseId,
            defaultgraphicCardId,
            defaulthardDiskArray,
            defaultmotherBoardId,
            defaultpowerSupplyId,
            defaultprocessorId,
            defaultramIdArray,
            discountOnPc:discountOnPc??0,

            motherBoardId: {
              create: motherBoardId.map((motherboard: string) => ({
                productId:motherboard
              })),
            },
            processorId: {
              create: processorId.map((cpu: any) => ({
                productId:cpu
              })),
            },
            graphicCardId: {
              create: graphicCardId.map((gpu: any) => ({
                productId:gpu
              })),
            },
            powerSupplyId: {
              create: powerSupplyId.map((powerSupply: any) => ({
                productId:powerSupply
              })),
            },
            caseId: {
              create: caseId.map((pcCase: any) => ({
                productId:pcCase
              })),
            },
            cooling: {
              create: coolings.map((pcCase: any) => ({
                productId:pcCase
              })),
            },
            ramIdArray: {
              create: ramIdArray.map((ramSlot: { rams: any[]; }) => ({
                Components: {
                  create: ramSlot.rams.map((ram: any) => ({
                    productId:ram
                  })),
                },
                
              })),
            },
            hardDiskArray: {
              create: hardDiskArray.map((storage: { disks: any[]; }) => ({
                Components: {
                  create: storage.disks.map((disk: any) => ({
                    productId:disk
                  })),
                },
           
              })),
            },

      },}}
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log('[PRODUCTS_PUT]', error);
    return new NextResponse("Internal error " + error, { status: 500 });
  }
};
