import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { pmID: string } }
) {
  try {
    if (!params.pmID) {
      return new NextResponse("processorModel id is required", { status: 400 });
    }

    const processorModel = await prismadb.processorModel.findUnique({
      where: {
        id: params.pmID
      }
    });
  
    return NextResponse.json(processorModel);
  } catch (error) {
    console.log('[processorModel_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(_: Request, { params }: { params: { pmID: string } }) {
  try {
    if (!params.pmID) return new NextResponse("processorModel id is required", { status: 400 });

    // prevent deleting if it's referenced by any Processor
    const used = await prismadb.processor.count({
      where: { processorModelId: params.pmID },
    });
    if (used > 0) {
      return new NextResponse("Cannot delete: in use by processors", { status: 409 });
    }

    await prismadb.processorModel.delete({ where: { id: params.pmID } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[PROCESSOR_MODEL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { pmID: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.pmID) {
      return new NextResponse("processorModel id is required", { status: 400 });
    }

  


    const processorModel = await prismadb.processorModel.update({
      where: {
        id: params.pmID,
      },
      data: {
        name  
      }
    });
  
    return NextResponse.json(processorModel);
  } catch (error) {
    console.log('[processorModel_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
