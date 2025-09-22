import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
  ) {
    try {
      const { searchParams } = new URL(req.url)
      const categoryId = searchParams.get('categoryId') || undefined;
      const isFeatured = searchParams.get('isFeatured');
  
  
  
      const products = await prismadb.product.count({

      
      });
    
      return NextResponse.json(products);
    } catch (error) {
      console.log('[PRODUCTS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  