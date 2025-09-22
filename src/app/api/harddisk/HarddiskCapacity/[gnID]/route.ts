import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { gnID: string } }
) {
  try {
    if (!params.gnID) {
      return new NextResponse("graphiccardName id is required", { status: 400 });
    }

    const graphiccardName = await prismadb.graphiccardName.findUnique({
      where: {
        id: params.gnID
      }
    });
  
    return NextResponse.json(graphiccardName);
  } catch (error) {
    console.log('[graphiccardName_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { gnID: string, storeId: string } }
) {
  try {
  

    if (!params.gnID) {
      return new NextResponse("graphiccardName id is required", { status: 400 });
    }

  
    const graphiccardName = await prismadb.graphiccardName.delete({
      where: {
        id: params.gnID,
      }
    });
  
    return NextResponse.json(graphiccardName);
  } catch (error) {
    console.log('[graphiccardName_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { gnID: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.gnID) {
      return new NextResponse("graphiccardName id is required", { status: 400 });
    }

  


    const graphiccardName = await prismadb.graphiccardName.update({
      where: {
        id: params.gnID,
      },
      data: {
        name  
      }
    });
  
    return NextResponse.json(graphiccardName);
  } catch (error) {
    console.log('[graphiccardName_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
