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
   
    const { NavbarCollection } = body;
   const  LocalCathegoryCollection =NavbarCollection as  LocalCathegoryCollection[]
   console.log(LocalCathegoryCollection[0].CathegoryCollectiondata)
   const col:CathegoryCollection[]= LocalCathegoryCollection.map( (item)=>({
    id:item.id,
    Label:item.Label,
    index:new Decimal(item.index.toString())

    }))

    LocalCathegoryCollection.map(async(dat)=>{
      const res= await prismadb.cathegoryCollection.create({ 
        data:
{
index:dat.index,
Label:dat.Label,
catgories:{
  create:dat.CathegoryCollectiondata.map((val) => ({
    index: val.index,
    catId: val.catId,
    Label: val.Label,
  })),}

}
}
   )
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
