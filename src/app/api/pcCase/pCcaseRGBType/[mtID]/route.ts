import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { mtID: string } }
) {
  try {
    if (!params.mtID) {
      return new NextResponse("memoryType id is required", { status: 400 });
    }

    const memoryType = await prismadb.memoryType.findUnique({
      where: {
        id: params.mtID
      }
    });
  
    return NextResponse.json(memoryType);
  } catch (error) {
    console.log('[memoryType_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { mtID: string, storeId: string } }
) {
  try {
  

    if (!params.mtID) {
      return new NextResponse("memoryType id is required", { status: 400 });
    }

  
    const memoryType = await prismadb.memoryType.delete({
      where: {
        id: params.mtID,
      }
    });
  
    return NextResponse.json(memoryType);
  } catch (error) {
    console.log('[memoryType_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { mtID: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.mtID) {
      return new NextResponse("memoryType id is required", { status: 400 });
    }

  


    const memoryType = await prismadb.memoryType.update({
      where: {
        id: params.mtID,
      },
      data: {
        name  
      }
    });
  
    return NextResponse.json(memoryType);
  } catch (error) {
    console.log('[memoryType_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
