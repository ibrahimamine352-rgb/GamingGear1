import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { manifacturerID: string } }
) {
  try {
    if (!params.manifacturerID) {
      return new NextResponse("manufacturer id is required", { status: 400 });
    }
    const body = await req.json();
    
    const { name, imageUrl } = body;
    
    const manufacturer = await prismadb.manufacturer.findUnique({
      where: {
        id: params.manifacturerID
      }
    });
    
    const manufacturerr = await prismadb.manufacturer.update({
      where: {
        id: params.manifacturerID
      },
      data: {
        name,
        imageUrl
      }
    });
  
    return NextResponse.json(manufacturer);
  } catch (error) {
    console.log('[manufacturer_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { manifacturerID: string, storeId: string } }
) {
  try {
  

    if (!params.manifacturerID) {
      return new NextResponse("manufacturer id is required", { status: 400 });
    }

  
    const manufacturer = await prismadb.manufacturer.delete({
      where: {
        id: params.manifacturerID,
      }
    });
  
    return NextResponse.json(manufacturer);
  } catch (error) {
    console.log('[manufacturer_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { manifacturerID: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }


    if (!params.manifacturerID) {
      return new NextResponse("manufacturer id is required", { status: 400 });
    }

  


    const manufacturer = await prismadb.manufacturer.update({
      where: {
        id: params.manifacturerID,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(manufacturer);
  } catch (error) {
    console.log('[manufacturer_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
