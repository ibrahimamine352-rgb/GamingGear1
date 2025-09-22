import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { LocalCathegoryCollection } from '@/app/(admin)/admin/(routes)/mainpage/components/Navbar';
import { Decimal } from '@prisma/client/runtime/library'; // Removed unused import
import { Prisma } from '@prisma/client';

export async function POST(
  req: Request,
  { params }: { params: {} }
) {
  try {
    const body = await req.json();
    const { NavbarCollection } = body;
    const LocalCathegoryCollection = NavbarCollection as LocalCathegoryCollection[];
    console.log(LocalCathegoryCollection[0].CathegoryCollectiondata);

    const col: Prisma.CathegoryCollectionCreateManyInput[] = LocalCathegoryCollection.map((item) => ({
      index: item.index,
      Label: item.Label.toString(),
      catgories: {
        create: item.CathegoryCollectiondata.map((val) => ({
          index: val.index,
          catId: val.catId.toString(),
          Label: val.Label.toString(),
        })),
      },
    }));

    await prismadb.cathegoryCollection.deleteMany();
    await prismadb.cathegoryCollection.createMany({
      data: col,
    });

    return NextResponse.json({});
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const categories = await prismadb.cathegoryCollection.findMany();

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
