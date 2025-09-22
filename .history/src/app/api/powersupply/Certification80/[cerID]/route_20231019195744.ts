import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { cerID: string } }
) {
  try {
    if (!params.cerID) {
      return new NextResponse("certification80 id is required", { status: 400 });
    }

    const certification80 = await prismadb.certification80.findUnique({
      where: {
        id: params.cerID
      }
    });
  
    return NextResponse.json(certification80);
  } catch (error) {
    console.log('[certification80_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { cerID: string, storeId: string } }
) {
  try {
  

    if (!params.cerID) {
      return new NextResponse("certification80 id is required", { status: 400 });
    }

  
    const certification80 = await prismadb.certification80.delete({
      where: {
        id: params.cerID,
      }
    });
  
    return NextResponse.json(certification80);
  } catch (error) {
    console.log('[certification80_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { cerID: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { number } = body;
    
  

    if (!number) {
      return new NextResponse("Label is required", { status: 400 });
    }


    if (!params.cerID) {
      return new NextResponse("certification80 id is required", { status: 400 });
    }

  


    const certification80 = await prismadb.certification80.update({
      where: {
        id: params.cerID,
      },
      data: {
        number
      }
    });
  
    return NextResponse.json(certification80);
  } catch (error) {
    console.log('[certification80_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
