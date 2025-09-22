import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  {  }: {  }
) {
  try {
  

    const body = await req.json();

    const { name, price, categoryId,  images, isFeatured, isArchived ,description,stock,additionalDetails,  caseId,
        graphicCardId,
        motherBoardId,
        powerSupplyId,
        processorId,
        hardDiskArray,
        ramIdArray,
        defaultcaseId,
              defaultgraphicCardId,
              defaulthardDiskArray,
              defaultmotherBoardId,
              defaultpowerSupplyId,
              defaultprocessorId,
              defaultramIdArray,
              discountOnPc,coolings} = body;
    if (!additionalDetails) {
      return new NextResponse("additionalDetails is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("description is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

  

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

   

   

    const product = await prismadb.preBuiltPcmodel.create({
      data: 
      {
        product:{
            create:{
                stock:0,
                name,
                price:0,
                isFeatured,
                isArchived,
                categoryId,
                description,
                
                additionalDetails:{
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
            create:{
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

                
            }
        }
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error "+error, { status: 500 });
  }
};

export async function DELETE(
  req: Request,
) {
  try {
 


    const products = await prismadb.pcTemplate.deleteMany();
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function GET(
  req: Request,
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const isFeatured = searchParams.get('isFeatured');


    const products = await prismadb.product.findMany({
      where: {
       
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
