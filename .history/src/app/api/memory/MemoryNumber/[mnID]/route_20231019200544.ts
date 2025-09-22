import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { mnID: string } }
) {
  try {
    if (!params.mnID) {
      return new NextResponse("memoryNumber id is required", { status: 400 });
    }

    const memoryNumber = await prismadb.memoryNumber.findUnique({
      where: {
        id: params.mnID
      }
    });
  
    return NextResponse.json(memoryNumber);
  } catch (error) {
    console.log('[memoryNumber_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { mnID: string, storeId: string } }
) {
  try {
  

    if (!params.mnID) {
      return new NextResponse("memoryNumber id is required", { status: 400 });
    }

  
    const memoryNumber = await prismadb.memoryNumber.delete({
      where: {
        id: params.mnID,
      }
    });
  
    return NextResponse.json(memoryNumber);
  } catch (error) {
    console.log('[memoryNumber_DELETE]', error);
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
      return new NextResponse("memoryNumber id is required", { status: 400 });
    }

  


    const memoryNumber = await prismadb.memoryNumber.update({
      where: {
        id: params.mnID,
      },
      data: {
        name  
      }
    });
  
    return NextResponse.json(memoryNumber);
  } catch (error) {
    console.log('[memoryNumber_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
