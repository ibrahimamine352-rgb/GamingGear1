import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { gabID: string } }
) {
  try {
    if (!params.gabID) {
      return new NextResponse("gpuArchBrand id is required", { status: 400 });
    }

    const gpuArchBrand = await prismadb.gpuArchBrand.findUnique({
      where: {
        id: params.gabID
      }
    });
  
    return NextResponse.json(gpuArchBrand);
  } catch (error) {
    console.log('[gpuArchBrand_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { gabID: string, storeId: string } }
) {
  try {
  

    if (!params.gabID) {
      return new NextResponse("gpuArchBrand id is required", { status: 400 });
    }

  
    const gpuArchBrand = await prismadb.gpuArchBrand.delete({
      where: {
        id: params.gabID,
      }
    });
  
    return NextResponse.json(gpuArchBrand);
  } catch (error) {
    console.log('[gpuArchBrand_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { gabID: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.gabID) {
      return new NextResponse("gpuArchBrand id is required", { status: 400 });
    }

  


    const gpuArchBrand = await prismadb.gpuArchBrand.update({
      where: {
        id: params.gabID,
      },
      data: {
        name  
      }
    });
  
    return NextResponse.json(gpuArchBrand);
  } catch (error) {
    console.log('[gpuArchBrand_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
