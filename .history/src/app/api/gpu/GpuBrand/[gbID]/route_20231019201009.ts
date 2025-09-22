import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { gbID: string } }
) {
  try {
    if (!params.gbID) {
      return new NextResponse("gpuBrand id is required", { status: 400 });
    }

    const gpuBrand = await prismadb.gpuBrand.findUnique({
      where: {
        id: params.gbID
      }
    });
  
    return NextResponse.json(gpuBrand);
  } catch (error) {
    console.log('[gpuBrand_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { gbID: string, storeId: string } }
) {
  try {
  

    if (!params.gbID) {
      return new NextResponse("gpuBrand id is required", { status: 400 });
    }

  
    const gpuBrand = await prismadb.gpuBrand.delete({
      where: {
        id: params.gbID,
      }
    });
  
    return NextResponse.json(gpuBrand);
  } catch (error) {
    console.log('[gpuBrand_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { gbID: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;
    
  

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.gbID) {
      return new NextResponse("gpuBrand id is required", { status: 400 });
    }

  


    const gpuBrand = await prismadb.gpuBrand.update({
      where: {
        id: params.gbID,
      },
      data: {
        name  
      }
    });
  
    return NextResponse.json(gpuBrand);
  } catch (error) {
    console.log('[gpuBrand_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
