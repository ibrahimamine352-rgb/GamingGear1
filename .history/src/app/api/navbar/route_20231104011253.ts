import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { LocalCathegoryCollection } from '@/app/(admin)/admin/(routes)/mainpage/components/Navbar';
 
export async function POST(
  req: Request,
  { params }: { params: { } }
) {
  try {
 

    const body = await req.json();
   
    const { NavbarCollection } = body;
   const  LocalCathegoryCollection =NavbarCollection as LocalCathegoryCollection[]
   LocalCathegoryCollection.map((item:any)=>{
      console.log(item)
    })

    
  
 



   
  
    return NextResponse.json({});
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
     
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
