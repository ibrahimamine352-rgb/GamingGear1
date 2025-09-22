import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { mnID: string } }
) {
  try {
    if (!params.mnID) {
      return new NextResponse("memoryMarque id is required", { status: 400 });
    }

    const memoryMarque = await prismadb.memoryMarque.findUnique({
      where: {
        id: params.mnID
      }
    });
  
    return NextResponse.json(memoryMarque);
  } catch (error) {
    console.log('[memoryMarque_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { mnID: string, storeId: string } }
) {
  try {
  

    if (!params.mnID) {
      return new NextResponse("memoryMarque id is required", { status: 400 });
    }

  
    const memoryMarque = await prismadb.memoryMarque.delete({
      where: {
        id: params.mnID,
      }
    });
  
    return NextResponse.json(memoryMarque);
  } catch (error) {
    console.log('[memoryMarque_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { mnID: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.mnID) {
      return new NextResponse("memoryMarque id is required", { status: 400 });
    }

  


    const memoryMarque = await prismadb.memoryMarque.update({
      where: {
        id: params.mnID,
      },
      data: {
        name  
      }
    });
  
    return NextResponse.json(memoryMarque);
  } catch (error) {
    console.log('[memoryMarque_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
