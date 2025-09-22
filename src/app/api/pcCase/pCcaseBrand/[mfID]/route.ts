import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { mfID: string } }
) {
  try {
    if (!params.mfID) {
      return new NextResponse("memoryFrequency id is required", { status: 400 });
    }

    const memoryFrequency = await prismadb.memoryFrequency.findUnique({
      where: {
        id: params.mfID
      }
    });
  
    return NextResponse.json(memoryFrequency);
  } catch (error) {
    console.log('[memoryFrequency_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { mfID: string, storeId: string } }
) {
  try {
  

    if (!params.mfID) {
      return new NextResponse("memoryFrequency id is required", { status: 400 });
    }

  
    const memoryFrequency = await prismadb.memoryFrequency.delete({
      where: {
        id: params.mfID,
      }
    });
  
    return NextResponse.json(memoryFrequency);
  } catch (error) {
    console.log('[memoryFrequency_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { mfID: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("Label is required", { status: 400 });
    }


    if (!params.mfID) {
      return new NextResponse("memoryFrequency id is required", { status: 400 });
    }

  


    const memoryFrequency = await prismadb.memoryFrequency.update({
      where: {
        id: params.mfID,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(memoryFrequency);
  } catch (error) {
    console.log('[memoryFrequency_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
