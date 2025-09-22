import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { SlideId: string } }
) {
  try {
    if (!params.SlideId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.slide.findUnique({
      where: {
        id: params.SlideId
      }
    });
  
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { SlideId: string } }
) {
  try {
  

    if (!params.SlideId) {
      return new NextResponse("slideId id is required", { status: 400 });
    }

  
    const billboard = await prismadb.slide.delete({
      where: {
        id: params.SlideId,
      }
    });
  
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { SlideId: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { title,description, imageUrl,mobilebgURl,bgUrl  } = body;
    
  

   

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.SlideId) {
      return new NextResponse("SlideId id is required", { status: 400 });
    }

  


    const billboard = await prismadb.slide.update({
      where: {
        id: params.SlideId,
      },
      data: {
        title,
        imageUrl,
        description,
        mobilebgURl:mobilebgURl??"",
        bgUrl:bgUrl??""
      }
    });
  
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
