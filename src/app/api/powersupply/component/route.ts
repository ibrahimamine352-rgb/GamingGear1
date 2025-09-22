
import { NextResponse } from 'next/server';


import prismadb from '@/lib/prismadb';
import { NextApiResponse } from 'next';
import { checkItemGroupsPower } from '@/app/(storefront)/build-pc/_componenets/Power';

export async function POST(
  req: Request,
  { params }: { params: {} }
) {
  try {


    const body = await req.json();

    const { name, price, categoryId, images, isFeatured, isArchived,  description, stock, additionalDetails,
      certification80ID,
      powersupplyMarqueID,
      modularity,
      Power,
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


    const cer= await prismadb.psCertification.findUnique({
      where:{
        id:certification80ID
      }
    })
    console.log(cer)


    const product = await prismadb.powersupply.create({
      data: {
        
    
        powersupplyMarqueId:powersupplyMarqueID,
        modularity,
        Power,
        certificationId:certification80ID
        , 
        products: {
          create: {

            name, price,
            categoryId,
            isFeatured,
            isArchived
            , description
            , stock,
            images: {
              createMany: {
                data: [...images]
              }},
            additionalDetails: {
              createMany: {
                data: [...additionalDetails]
              }

            },
          }
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
      powersupplies: {
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
           price: 'asc',
          };
      }
    }else{
      orderByClause = {
        price: 'asc', // or 'desc' depending on your preference
      };
    }
 

    const filterListParam = searchParams.get('filterList');
   
     if (filterListParam) {
      const decodedFilterList = JSON.parse(decodeURIComponent(filterListParam)) as checkItemGroupsPower;
    
      const cpuFilters = [];
    
      const chipsetFilter = decodedFilterList.powersupplyMarque;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
          Marque: {
            name: {
              in: decodedFilterList.powersupplyMarque.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardcpusupportFilter = decodedFilterList.psCertification;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        cpuFilters.push({
          certification: {
            name: {
              in: decodedFilterList.psCertification.map(item => item.searchKey),
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
        whereClause.powersupplies = {
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
          powersupplys:true
        }
      })

      if(prossa.length>0){
        whereClause.id={
          in: prossa
    .flatMap((e) => e.powersupplys.map((ee) => ee.productId))
    .filter((productId) => productId !== undefined), 
        }
        console.log( whereClause.id)
      }
    }
    console.log(whereClause)
    const products = await prismadb.product.findMany({
      where: whereClause,
      include: {
        powersupplies: true,
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