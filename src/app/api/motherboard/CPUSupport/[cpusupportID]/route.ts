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
  _req: Request,
  { params }: { params: { cpusupportID: string } }
) {
  try {
    if (!params.cpusupportID) {
      return new NextResponse("CPU support id is required", { status: 400 });
    }

    // Check ALL relations that reference CPUSupport
    const [inProcessors, inMotherboards, inCooling] = await Promise.all([
      prismadb.processor.count({ where: { cpusupportId: params.cpusupportID } }),
      prismadb.motherboard.count({ where: { cpusupportId: params.cpusupportID } }),
      prismadb.cooling.count({ where: { CPUSupportId: params.cpusupportID } }),
    ]);

    const total = inProcessors + inMotherboards + inCooling;
    if (total > 0) {
      return new NextResponse(
        `Cannot delete: still in use (processors=${inProcessors}, motherboards=${inMotherboards}, cooling=${inCooling}).`,
        { status: 409 }
      );
    }

    await prismadb.cPUSupport.delete({ where: { id: params.cpusupportID } });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.log("[cPUSupport_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}



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
        name  
      }
    });
  
    return NextResponse.json(cPUSupport);
  } catch (error) {
    console.log('[cPUSupport_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
