import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string} }
  ) {
    try {

      const body = await req.json();

  
      const { status,
        archive
  } = body;
  
  console.log(status)
      if (!params.id) {
        return new NextResponse("Product id is required", { status: 400 });
      }
 

      const product = await prismadb.order.update({
        where: {
          id: params.id
        },
        data: {
          archivee:archive,
         isPaid:status
        },
      })
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[PRODUCT_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };