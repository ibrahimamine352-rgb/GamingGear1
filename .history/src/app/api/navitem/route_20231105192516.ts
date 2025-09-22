import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { LocalCathegoryCollection } from '@/app/(admin)/admin/(routes)/mainpage/components/Navbar';
import { CathegoryCollection } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
 
export async function POST(
  req: Request,
  { params }: { params: { } }
) {
  try {
 

    const body = await req.json();
   
    const { nav } = body;
    const col = await prismadb.cathegoryCollection.create({
      data:{
        navitemId:'',
        index:0,
        Label:'',
      
      }
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
 

    const categories = await prismadb.cathegoryCollection.findMany({
     
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
