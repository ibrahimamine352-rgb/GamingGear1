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
    { params }: { params: { productId: string} }
  ) {
    try {
 
      const body = await req.json();

  
      const { name, price, categoryId,  images, isFeatured, isArchived ,     
        resolutionId,
        curved,
        RefreshRateId,
        PouceId,markId,additionalDetails
  } = body;
  

      if (!params.productId) {
        return new NextResponse("Product id is required", { status: 400 });
      }

      if (!name) {
        return new NextResponse("Name is required", { status: 400 });
      }

      if (!images || !images.length) {
        return new NextResponse("Images are required", { status: 400 });
      }

      if (!price) {
        return new NextResponse("Price is required", { status: 400 });
      }

      if (!categoryId) {
        return new NextResponse("Category id is required", { status: 400 });
      }

    

  
    const prod =await prismadb.product.findUnique({
      where:{
        id:params.productId
      },include:{
        screens:true
      }
    }) 

      await prismadb.screen.update({
        where:{
          id: prod!.screens[0].id
        },
        data:{
          resolutionId,
        curved,
        RefreshRateId,
        PouceId,
        MarkId:markId,
          
        }

      });


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
  
      const product = await prismadb.product.update({
        where: {
          id: params.productId
        },
        data: {
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
      })
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[PRODUCT_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
