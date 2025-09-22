import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: {  } }
) {
  try {
   

    const body = await req.json();

    const { title, imageUrl,url,description,mobilebgURl,bgUrl ,discount,titleColor,descriptionColor} = body;

   

 
   
    const billboard = await prismadb.slide.create({
      data: {
        title,
        imageUrl:imageUrl??"",
        description,
        url,
        discount,
        mobilebgURl:mobilebgURl??"",
        bgUrl:bgUrl??"",
        titleColor,
        descriptionColor
  
      }
    });
  
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await prismadb.slide.findMany({
     
    });
  
    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
