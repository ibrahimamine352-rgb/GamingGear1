import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: { } }
) {
  try {
 

    const body = await req.json();

    const { name } = body;

    
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    
 

   
    const category = await prismadb.category.create({
      data: {
        name
       
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
) {
  try {
 

    const categories = await prismadb.category.findMany({
     where:{
      products:{some:{}}
     }
    });
  
    return Response.json({data:categories});
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
