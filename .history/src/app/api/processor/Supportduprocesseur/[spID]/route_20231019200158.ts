import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { spID: string } }
) {
  try {
    if (!params.spID) {
      return new NextResponse("supportduprocesseur id is required", { status: 400 });
    }

    const supportduprocesseur = await prismadb.supportduprocesseur.findUnique({
      where: {
        id: params.spID
      }
    });
  
    return NextResponse.json(supportduprocesseur);
  } catch (error) {
    console.log('[supportduprocesseur_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { spID: string, storeId: string } }
) {
  try {
  

    if (!params.spID) {
      return new NextResponse("supportduprocesseur id is required", { status: 400 });
    }

  
    const supportduprocesseur = await prismadb.supportduprocesseur.delete({
      where: {
        id: params.spID,
      }
    });
  
    return NextResponse.json(supportduprocesseur);
  } catch (error) {
    console.log('[supportduprocesseur_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { spID: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }


    if (!params.spID) {
      return new NextResponse("supportduprocesseur id is required", { status: 400 });
    }

  


    const supportduprocesseur = await prismadb.supportduprocesseur.update({
      where: {
        id: params.spID,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(supportduprocesseur);
  } catch (error) {
    console.log('[supportduprocesseur_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
