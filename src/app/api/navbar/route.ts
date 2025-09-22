import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { LocalCathegoryCollection } from '@/app/(admin)/admin/(routes)/mainpage/components/Navbar';
import { CathegoryCollection } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
 
export async function POST(
  req: Request,
  { params }: { params: { } }
) {
 
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
