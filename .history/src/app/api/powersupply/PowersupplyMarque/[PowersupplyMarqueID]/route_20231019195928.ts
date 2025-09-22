import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { PowersupplyMarqueID: string } }
) {
  try {
    if (!params.PowersupplyMarqueID) {
      return new NextResponse("powersupplyMarque id is required", { status: 400 });
    }

    const powersupplyMarque = await prismadb.powersupplyMarque.findUnique({
      where: {
        id: params.PowersupplyMarqueID
      }
    });
  
    return NextResponse.json(powersupplyMarque);
  } catch (error) {
    console.log('[powersupplyMarque_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { PowersupplyMarqueID: string, storeId: string } }
) {
  try {
  

    if (!params.PowersupplyMarqueID) {
      return new NextResponse("powersupplyMarque id is required", { status: 400 });
    }

  
    const powersupplyMarque = await prismadb.powersupplyMarque.delete({
      where: {
        id: params.PowersupplyMarqueID,
      }
    });
  
    return NextResponse.json(powersupplyMarque);
  } catch (error) {
    console.log('[powersupplyMarque_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { PowersupplyMarqueID: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.PowersupplyMarqueID) {
      return new NextResponse("powersupplyMarque id is required", { status: 400 });
    }

  


    const powersupplyMarque = await prismadb.powersupplyMarque.update({
      where: {
        id: params.PowersupplyMarqueID,
      },
      data: {
        name  
      }
    });
  
    return NextResponse.json(powersupplyMarque);
  } catch (error) {
    console.log('[powersupplyMarque_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
