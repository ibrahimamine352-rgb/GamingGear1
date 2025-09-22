import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST( req: Request) {
    try { 
        const body = await req.json();
        const { name } = body;
        const format=await db.lapProcesseur.create({
            data: {
                name
            }
        })
        return NextResponse.json(format);
        
     } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
      }
    
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
  ) {
    try {
  
  
      const products = await db.motherboardChipset.findMany();
    
      return NextResponse.json(products);
    } catch (error) {
      console.log('[PRODUCTS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };