import { db } from "@/lib/db";
import { create } from "domain";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
  ) {
    try {
        const body = await req.json();

        const { name, imageUrl } = body;
        const manufacturer=db.manufacturer.create({
            data:{
                name:name,
                imageUrl:imageUrl

            }
        })
        return NextResponse.json(manufacturer);
    }catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
      }



  }

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
  ) {
    try {
      const { searchParams } = new URL(req.url)
      const categoryId = searchParams.get('categoryId') || undefined;
      const isFeatured = searchParams.get('isFeatured');
  
  
  
      const products = await db.product.findMany({
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
  

  