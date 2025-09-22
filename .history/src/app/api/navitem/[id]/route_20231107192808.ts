import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { LocalCathegoryCollection } from "@/app/(admin)/admin/(routes)/mainpage/components/Navbar";
import { CathegoryCollection } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {



    if (!params.id) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    console.log(params.id)
  
    const col= await prismadb.navitem.findUnique(
      {where:{id:params.id.toString()}}
    )
  

    const category = await prismadb.navitem.delete({
      where: {
        id: params.id,
      },
      include:{
        CathegoryCollection:true
      }
    });
  

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { id: string} }
) {
  try {   

    const body = await req.json();
    
    const { link,name,NavbarCollection } = body;


    

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.id) {
      return new NextResponse("Category id is required", { status: 400 });
    }


    await prismadb.navitem.update({
      where:{
        id:params.id
      },
      data:{
        label:name,
        link
      }
    })

     const  LocalCathegoryCollection =NavbarCollection as  LocalCathegoryCollection[]
  
     const col:CathegoryCollection[]= LocalCathegoryCollection.map( (item)=>({
      id:item.id.toString(),
      Label:item.Label.toString(),
      navitemId:params.id,
      index:new Decimal(item.index.toString())
  
      }))
      await prismadb.cathegoryCollection.deleteMany({
        where:{
          navitemId:params.id
        }
      })
      LocalCathegoryCollection.map(async(dat)=>{
   await prismadb.cathegoryCollection.create({ 
          data:
  {
  index:dat.index,
  Label:dat.Label.toString(),
  navitemId:params.id,
  catgories:{
    createMany:{data:[...dat.CathegoryCollectiondata.map((val) => ({
      index: val.index,
      catId: val.catId.toString(),
      Label: val.Label.toString(),
    }))],}}
  
  }
  }
     )
      })
    
     

  
      return NextResponse.json(LocalCathegoryCollection);
    } catch (error) {
      console.log('[CATEGORY_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }





}
