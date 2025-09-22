import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { mcID: string } }
) {
  try {
    if (!params.mcID) {
      return new NextResponse("motherboardChipset id is required", { status: 400 });
    }

    const motherboardChipset = await prismadb.motherboardChipset.findUnique({
      where: {
        id: params.mcID
      }
    });
  
    return NextResponse.json(motherboardChipset);
  } catch (error) {
    console.log('[motherboardChipset_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { mcID: string, storeId: string } }
) {
  try {
  

    if (!params.mcID) {
      return new NextResponse("motherboardChipset id is required", { status: 400 });
    }

  
    const motherboardChipset = await prismadb.motherboardChipset.delete({
      where: {
        id: params.mcID,
      }
    });
  
    return NextResponse.json(motherboardChipset);
  } catch (error) {
    console.log('[motherboardChipset_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { mcID: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("Label is required", { status: 400 });
    }


    if (!params.mcID) {
      return new NextResponse("motherboardChipset id is required", { status: 400 });
    }

  


    const motherboardChipset = await prismadb.motherboardChipset.update({
      where: {
        id: params.mcID,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(motherboardChipset);
  } catch (error) {
    console.log('[motherboardChipset_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
