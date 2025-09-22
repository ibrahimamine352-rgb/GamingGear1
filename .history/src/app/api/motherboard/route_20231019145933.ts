
import { NextResponse } from 'next/server';


import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { } }
) {
  try {
    

    const body = await req.json();

    const { name, price, categoryId,  images, isFeatured, isArchived } = body;

 

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



    const product = await prismadb.motherboard.create({
        data:{
            chipsetId:"azdaz",
            cpusupportId:"aazd",
            formatId:"azdza",
            guaranteeId:"azdza",
            manufacturerId:"azdazd",
            ramslotsId:"aazd",

            product:{
                create:{
                   
                    name,
                    price,
                    isFeatured,
                    isArchived,
                    categoryId,
                    images: {
                      createMany: {
                        data: [
                          ...images.map((image: { url: string }) => image),
                        ],
                      },
                    
                  },}
        }
     
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
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
