import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { rsID: string } }
) {
  try {
    if (!params.rsID) {
      return new NextResponse("ramSlots id is required", { status: 400 });
    }

    const ramSlots = await prismadb.ramSlots.findUnique({
      where: {
        id: params.rsID
      }
    });
  
    return NextResponse.json(ramSlots);
  } catch (error) {
    console.log('[ramSlots_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { rsID: string, storeId: string } }
) {
  try {
  

    if (!params.rsID) {
      return new NextResponse("ramSlots id is required", { status: 400 });
    }

  
    const ramSlots = await prismadb.ramSlots.delete({
      where: {
        id: params.rsID,
      }
    });
  
    return NextResponse.json(ramSlots);
  } catch (error) {
    console.log('[ramSlots_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { rsID: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { number } = body;
    
  

    if (!number) {
      return new NextResponse("Label is required", { status: 400 });
    }


    if (!params.rsID) {
      return new NextResponse("ramSlots id is required", { status: 400 });
    }

  


    const ramSlots = await prismadb.ramSlots.update({
      where: {
        id: params.rsID,
      },
      data: {
        number
      }
    });
  
    return NextResponse.json(ramSlots);
  } catch (error) {
    console.log('[ramSlots_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
