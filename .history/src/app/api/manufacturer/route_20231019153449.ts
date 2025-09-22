import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }




    
  ) {
    try {



        const body = await req.json();

        const { name, image } = body;
        
    }catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
      }



  }