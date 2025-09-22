import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { cpusupportID: string } }
) {
  try {
    if (!params.cpusupportID) {
      return new NextResponse("cPUSupport id is required", { status: 400 });
    }

    const cPUSupport = await prismadb.cPUSupport.findUnique({
      where: {
        id: params.cpusupportID
      }
    });
  
    return NextResponse.json(cPUSupport);
  } catch (error) {
    console.log('[cPUSupport_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { cpusupportID: string, storeId: string } }
) {
  try {
  

    if (!params.cpusupportID) {
      return new NextResponse("cPUSupport id is required", { status: 400 });
    }

  
    const cPUSupport = await prismadb.cPUSupport.delete({
      where: {
        id: params.cpusupportID,
      }
    });
  
    return NextResponse.json(cPUSupport);
  } catch (error) {
    console.log('[cPUSupport_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { cpusupportID: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.cpusupportID) {
      return new NextResponse("cPUSupport id is required", { status: 400 });
    }

  


    const cPUSupport = await prismadb.cPUSupport.update({
      where: {
        id: params.cpusupportID,
      },
      data: {
        label,
        imageUrl
      }
    });
  
    return NextResponse.json(cPUSupport);
  } catch (error) {
    console.log('[cPUSupport_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
