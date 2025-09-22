import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { cerID: string } }
) {
  try {
    if (!params.cerID) {
      return new NextResponse("pscertification id is required", { status: 400 });
    }

    const pscertification = await prismadb.psCertification.findUnique({
      where: {
        id: params.cerID
      }
    });
  
    return NextResponse.json(pscertification);
  } catch (error) {
    console.log('[pscertification_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { cerID: string, storeId: string } }
) {
  try {
  

    if (!params.cerID) {
      return new NextResponse("pscertification id is required", { status: 400 });
    }

  
    const pscertification = await prismadb.psCertification.delete({
      where: {
        id: params.cerID,
      }
    });
  
    return NextResponse.json(pscertification);
  } catch (error) {
    console.log('[pscertification_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { cerID: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("Label is required", { status: 400 });
    }


    if (!params.cerID) {
      return new NextResponse("pscertification id is required", { status: 400 });
    }

  


    const pscertification = await prismadb.psCertification.update({
      where: {
        id: params.cerID,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(pscertification);
  } catch (error) {
    console.log('[pscertification_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
