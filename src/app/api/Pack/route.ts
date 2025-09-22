import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  {}: {}
) {
  try {
    const body = await req.json();

    // Safe destructuring (arrays default to [])
    const {
      name,
      price,
      categoryId,
      images,
      isFeatured,
      isArchived,
      description,
      stock,

      Clavier = [],
      Mouse = [],
      MousePad = [],
      Mic = [],
      Headset = [],
      Camera = [],
      Screen = [],
      Speaker = [],
      Manette = [],
      Chair = [],

      discountOnPack = 0,
      dicountPrice = 0,
      DefaultClavier,
      DefaultMouse,
      DefaultMousePad,
      DefaultMic,
      DefaultHeadset,
      DefaultCamera,
      DefaultScreen,
      DefaultSpeaker,
      DefaultManette,
      DefaultChair,
      DefaultPack,              // OK to keep in destructuring; we just won't use it below
      additionalDetails = [],
    } = body;

    console.log(body);

    if (!description) {
      return new NextResponse('description is required', { status: 400 });
    }
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    const product = await prismadb.accessoryPack.create({
      data: {
        Product: {
          create: {
            name,
            price: price,
            isFeatured,
            isArchived,
            description,
            categoryId,
            stock,
            dicountPrice,
            additionalDetails: {
              createMany: {
                data: [...additionalDetails],
              },
            },
            images: {
              createMany: {
                data: images.map((image: { url: string }) => ({
                  url: image.url,
                })),
              },
            },
          },
        },

        // pointers & numeric fields valid on accessoryPack
        discountOnPack,
        DefaultCamera,
        DefaultChair,
        DefaultClavier,
        DefaultHeadset,
        DefaultManette,
        DefaultMic,
        DefaultMouse,
        DefaultMousePad,
        DefaultScreen,
        DefaultSpeaker,
        // ❌ DefaultPack removed here (not a field on accessoryPack)

        // relation connects (now always arrays)
        Clavier: { connect: Clavier.map((i: any) => ({ id: i.id })) },
        Camera: { connect: Camera.map((i: any) => ({ id: i.id })) },
        Chair: { connect: Chair.map((i: any) => ({ id: i.id })) },
        Headset: { connect: Headset.map((i: any) => ({ id: i.id })) },
        Manette: { connect: Manette.map((i: any) => ({ id: i.id })) },
        Mouse: { connect: Mouse.map((i: any) => ({ id: i.id })) },
        MousePad: { connect: MousePad.map((i: any) => ({ id: i.id })) },
        Screen: { connect: Screen.map((i: any) => ({ id: i.id })) },
        Mic: { connect: Mic.map((i: any) => ({ id: i.id })) },
        Speaker: { connect: Speaker.map((i: any) => ({ id: i.id })) },
      },
    });

    console.log('[PRODUCTS_POST]', product);
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error ' + error, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const products = await prismadb.accessoryPack.deleteMany();
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const products = await prismadb.accessoryPack.findMany({
      include: {
        Camera: true,
        Chair: true,
        Clavier: true,
        Headset: true,
        Manette: true,
        Mic: true,
        Mouse: true,
        MousePad: true,
        Product: true,
        Screen: true,
        Speaker: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
