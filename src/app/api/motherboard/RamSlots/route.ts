import { db } from "@/lib/db";
import prismadb from "@/lib/prismadb";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST( req: Request) {
    try { 
        const body = await req.json();
        const { number , name,
            type, } = body;
        if(!number){
            return new NextResponse("ram error", { status: 500 });
        }
        
        const format=await prismadb.ramSlots.create({
            data: {
                name,
                type,
                number
            }
        })
        return NextResponse.json(format);
        
     } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error"+error, { status: 500 });
      }
    
}


export async function GET(req: Request, res: NextApiResponse) {
    try {
      const { searchParams } = new URL(req.url || '', 'http://localhost');
  
      const motherboardId = searchParams.get('id') ||'';
   
  
  
    
      const products = await prismadb.ramSlots.findFirst({
        where:{
            motherboards:{
                some:{
                    products:{
                        some:{
                            id:motherboardId
                        }
                    }
                }
            }
        } ,
        include: {
         
        },
      
      });
      
      console.log();
      return NextResponse.json(products);
    } catch (error) {
      console.error('[PRODUCTS_GET]', error);
      res.status(500).json({ error: 'Internal error' });
    }
  }