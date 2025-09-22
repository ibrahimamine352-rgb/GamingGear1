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

 
    const {
      name,
      price,
      categoryId,
      images,
      isFeatured,
      isArchived,
      chipsetId,
      cpusupportId,
      formatId,
      manufacturerId,
      ramslotsId,
      description,
      stock,
      dicountPrice,
      additionalDetails
    } = body;

 

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
    if (!chipsetId) {
      return new NextResponse("chipsetId is required", { status: 400 });
    }

    if (!cpusupportId ) {
      return new NextResponse("cpusupportId are required", { status: 400 });
    }

    if (!formatId) {
      return new NextResponse("formatId is required", { status: 400 });
    }

    if (!ramslotsId) {
      return new NextResponse("ramslotsId id is required", { status: 400 });
    }
    if (!stock) {
      return new NextResponse("stock id is required", { status: 400 });
    }
 if (!manufacturerId) {
      return new NextResponse("manufacturerId id is required", { status: 400 });
    }

    const associatedMotherboards = await prismadb.motherboard.findFirst({
      where: {
        products: {
          some: {
            id: params.productId
          }
        }
      }
    });
    
   await prismadb.motherboard.update({
      where: {
     
            id: associatedMotherboards?.id
          
        },

      data: {
        chipsetId: chipsetId,
        cpusupportId: cpusupportId,
        formatId: formatId,
        manufacturerId: manufacturerId,
        ramslotsId: ramslotsId,
      }
    });


    await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        price: price,
        isFeatured: isFeatured,
        isArchived: isArchived,
        description,
        categoryId: categoryId,
        stock:stock,
        dicountPrice:dicountPrice,
      
        images: {
          deleteMany: {},
        },
        additionalDetails: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        additionalDetails: {
          createMany: {
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
export async function FETCH(
  req: Request,
  { params }: { params: { productId: string,page:number,units:number,q:string} }
) {
  try {
    console.log(req)
    console.log(params.q)
    return NextResponse.json([]);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};