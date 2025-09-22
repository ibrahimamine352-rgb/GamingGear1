
import { NextResponse } from 'next/server';


import prismadb from '@/lib/prismadb';
import { NextApiResponse } from 'next';
import { checkItemGroupsCase } from '@/app/(storefront)/build-pc/_componenets/Case';
import { checkItemGroupsCooling } from '@/app/(storefront)/build-pc/_componenets/Cooling';

export async function POST(
  req: Request,
  { params }: { params: { } }
) {
  try {
    

    const body = await req.json(); 

    const { name, price, categoryId,  images, isFeatured, isArchived ,
      CPUSupportId,
      CoolingMarkId,
      CoolingTypeId,
      FansNumberId,
      rgb,
description,
stock,
dicountPrice,
} = body;
   
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
console.log("dazdz")


    const product = await prismadb.cooling.create({
        data:{
          CPUSupportId,
          CoolingMarkId,
          CoolingTypeId,
          FansNumberId,
          Rgb: rgb,
            product:{
                create:{
                   
               
      name,
      price: price,
      isFeatured: isFeatured,
      isArchived: isArchived,
      description:description,
      categoryId: categoryId,
      stock:stock,
      dicountPrice:dicountPrice,
    
      images: {
        createMany: {
          data: images.map((image: { url: string }) => ({
            url: image.url,
          })),
        }
         // Replace any with the actual data types from your Prisma schema
    
     
    },}
        }
     
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}; 

export async function GET(req: Request, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url || '', 'http://localhost');

    const page = parseInt(searchParams.get('page') || '0');
    const units = parseInt(searchParams.get('units') || '14') || 14;
    const q = searchParams.get('q') || '';
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort') || '';
    const maxDt = searchParams.get('maxDt') || '';
    const minDt = searchParams.get('minDt') || ''; 
    const motherboardId = searchParams.get('motherboardId') || '';


   
    const whereClause: Record<string, any> = {
      isArchived:false ,
      cooling: {
        some: {},
      },
    };
  
    if (q) {
      whereClause.name = {
        contains: q,
        mode: 'insensitive',
      };
    }
    let orderByClause: Record<string, 'asc' | 'desc'> = {};

    if (sort && sort.length > 0) {
      switch (sort) {
        case 'Les plus populaires':
          orderByClause = {
            soldnumber: 'desc',
          };
          break; 
        case 'Les plus récents':
          orderByClause = {
            price: 'desc', // or 'desc' depending on your preference
          };
          break;
        case 'Les plus récents':
          orderByClause = {
            createdAt: 'asc', // or 'desc' depending on your preference
          };
          break;
        case 'Prix : Croissant':
          orderByClause = {
            price: 'asc', // or 'desc' depending on your preference
          };
          break;
        case 'Prix : Décroissant':
          orderByClause = {
            price: 'desc', // or 'desc' depending on your preference
          };
          break;
        // Add more cases for other fields you want to support
        default:
          // Default sorting if no match is found
          orderByClause = {
            createdAt: 'desc',
          };
      }
    }else{
      orderByClause = {
        price: 'asc', // or 'desc' depending on your preference
      };
    }
 

    const filterListParam = searchParams.get('filterList');
   
     if (filterListParam) {
      const decodedFilterList = JSON.parse(decodeURIComponent(filterListParam)) as checkItemGroupsCooling;
    
      const cpuFilters = [];
    
      const chipsetFilter = decodedFilterList.coolingMark;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
          CoolingMark: {
            name: {
              in: decodedFilterList.coolingMark.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardcpusupportFilter = decodedFilterList.coolingType;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        cpuFilters.push({
          CoolingType: {
            name: {
              in: decodedFilterList.coolingType.map(item => item.searchKey),
            },
          },
        });
      }
      const pCcaseNumberofFansPreinstalled = decodedFilterList.coolingcPUSupport;
      if (pCcaseNumberofFansPreinstalled && pCcaseNumberofFansPreinstalled.length > 0) {
        cpuFilters.push({
          numberofFansPreinstalled: {
            number: {
              in: decodedFilterList.coolingcPUSupport.map(item => item.searchKey),
            },
          },
        });
      }
      const pCcaseRGBType = decodedFilterList.fansNumber;
      if (pCcaseRGBType && pCcaseRGBType.length > 0) {
        cpuFilters.push({
          FansNumber: {
            name: {
              in: decodedFilterList.fansNumber.map(item => parseInt(item.searchKey)),
            },
          },
        });
      }
      if(maxDt.length>0&&maxDt.length){
        whereClause.price = {
          lte: parseInt(maxDt),
        };
        if (minDt.length>0&&minDt.length ) {
          whereClause.price = {
            ...(whereClause.price || {}),
            gte: parseInt(minDt),
          };
        }
      }
     
      if (cpuFilters.length > 0) {
        whereClause.cooling = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    }

    if(motherboardId.length>0){
      const prossa=  await prismadb.compatibiltyProfile.findMany({
        where:{
          motherboards:{
            some:{
              productId:{
                equals:motherboardId
              }
            }
          }
        },
        include:{
          coolings:true
        }
      })

      if(prossa.length>0){
        whereClause.id={
          in: prossa
    .flatMap((e) => e.coolings.map((ee) => ee.productId))
    .filter((productId) => productId !== undefined), 
        }
        console.log( whereClause.id)
      }
    }
    console.log(whereClause)
    const products = await prismadb.product.findMany({
      where: whereClause,
      include: {
      
        images: true,
      },
      orderBy: orderByClause,
      take: units,
      skip: page * units,
    });
    const total=  await prismadb.product.count({
      where: whereClause,
    
   
    });
    console.log();
    return NextResponse.json({data:products,total});
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    res.status(500).json({ error: 'Internal error' });
  }
}