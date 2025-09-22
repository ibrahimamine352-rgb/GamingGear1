import { db } from "@/lib/db";
import { create } from "domain";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
  ) {
    try {
        const body = await req.json();

        const { name, imageUrl } = body;
        const manufacturer=db.manufacturer.create({
            data:{
                name:name,
                imageUrl:imageUrl

            }
        })
        return NextResponse.json(manufacturer);
    }catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
      }



  }