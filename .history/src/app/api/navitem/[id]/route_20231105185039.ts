import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

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
      }
    });
   await prismadb.cathegoryCollection.delete({
      where: {
        id: params.id,
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
  { params }: { params: { categoryId: string, storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { name } = body;


    

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }




    const category = await prismadb.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
