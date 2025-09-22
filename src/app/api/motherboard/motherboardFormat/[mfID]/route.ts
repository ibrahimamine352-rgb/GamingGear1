import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { mfID: string } }
) {
  try {
    if (!params.mfID) {
      return new NextResponse("motherboardFormat id is required", { status: 400 });
    }

    const motherboardFormat = await prismadb.motherboardFormat.findUnique({
      where: {
        id: params.mfID
      }
    });
  
    return NextResponse.json(motherboardFormat);
  } catch (error) {
    console.log('[motherboardFormat_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { mfID: string, storeId: string } }
) {
  try {
  

    if (!params.mfID) {
      return new NextResponse("motherboardFormat id is required", { status: 400 });
    }

  
    const motherboardFormat = await prismadb.motherboardFormat.delete({
      where: {
        id: params.mfID,
      }
    });
  
    return NextResponse.json(motherboardFormat);
  } catch (error) {
    console.log('[motherboardFormat_DELETE]', error);
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
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.mfID) {
      return new NextResponse("motherboardFormat id is required", { status: 400 });
    }

  


    const motherboardFormat = await prismadb.motherboardFormat.update({
      where: {
        id: params.mfID,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(motherboardFormat);
  } catch (error) {
    console.log('[motherboardFormat_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
