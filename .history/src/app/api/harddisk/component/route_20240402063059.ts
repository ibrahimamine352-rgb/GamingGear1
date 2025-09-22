
import { NextResponse } from 'next/server';


import prismadb from '@/lib/prismadb';
import { NextApiResponse } from 'next';
import { checkItemGroupsHardDisk } from '@/app/(storefront)/build-pc/_componenets/HardDisk'; 

export async function POST(
  req: Request,
  { params }: { params: { } }
) {
  try {
    const body = await req.json();

    const {
      name, price, categoryId,  images, isFeatured, isArchived ,description,stock,additionalDetails,
      brandId,
      capacityId,
   
      ComputerinterfaceId,
      typeId,
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

   const motherboard = await prismadb.harddisk.create({
  data: {
    brandId,
    capacityId,
  
    ComputerinterfaceId,
    typeId,
    product: {
    create:{

      name, price, 
      categoryId,
       isFeatured,
        isArchived 
        ,description
        ,stock,
        additionalDetails:{
          createMany:{
           data: [...additionalDetails]
          }

        }
        ,
    images: {
      createMany: {
        data: images.map((image: { url: string }) => ({
          url: image.url,
        })),
      }
       // Replace any with the actual data types from your Prisma schema
  
   
  },
    }
   }}
});

    

    return  NextResponse.json(motherboard);
  } catch (error) {
    console.log('[MOTHERBOARD_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url || '', 'http://localhost');

    const page = parseInt(searchParams.get('page') || '1');
    const units = parseInt(searchParams.get('units') || '14') || 14;
    const q = searchParams.get('q') || '';
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort') || '';
    const motherboardId = searchParams.get('motherboardId') || '';
    const whereClause: Record<string, any> = {
      isArchived:false ,
      storages: {
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
    }
 
    const filterListParam = searchParams.get('filterList');
    if (filterListParam) {
      const decodedFilterList = JSON.parse(decodeURIComponent(filterListParam)) as checkItemGroupsHardDisk;
    
      const memoryFilters = [];
    
      const motherboardcpusupportFilter = decodedFilterList.harddiskBrand;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        memoryFilters.push({
          brand: {
            name: {
              in: decodedFilterList.harddiskBrand.map(item => item.searchKey),
            },
       
          
        }});
      }
    
      const motherboardformatFilter = decodedFilterList.harddiskCapacity;
      if (motherboardformatFilter && motherboardformatFilter.length > 0) {
        memoryFilters.push({
          capacity: {
            name: {
              in: decodedFilterList.harddiskCapacity.map(item => parseInt(item.searchKey)),
            },
          },
        });
      }
    
      const motherboardmanufacturerFilter = decodedFilterList.harddiskComputerinterface;
      if (motherboardmanufacturerFilter && motherboardmanufacturerFilter.length > 0) {
        memoryFilters.push({
          Computerinterface: {
            name: {
              in: decodedFilterList.harddiskComputerinterface.map(item => item.searchKey),
            },
          },
        }); 
      }
    
      const memoryMarqueFilter = decodedFilterList.harddiskType;
      if (memoryMarqueFilter && memoryMarqueFilter.length > 0) {
        memoryFilters.push({
          type: {
            name: {
              in: decodedFilterList.harddiskType.map(item => item.searchKey),
            },
          },
        });
      }
    
      console.log(memoryFilters)
      if (memoryFilters.length > 0) {
        whereClause.storages = {
          some: {
            AND: memoryFilters,
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
          disks:{
            include:{
              Components:true
            }
          }
        }
      })

      if(prossa.length>0){
        whereClause.id={
          in: prossa
    .flatMap((e) => e.disks.map((ee) => ee.Components.flatMap((az)=>az.productId))).flat()
    .filter((productId) => productId !== undefined), 
        }
        console.log( whereClause.id)
      }
    }

    
    const products = await prismadb.product.findMany({
      where: whereClause,
      include: {
        storages: {
          include:{
            type:true,
            brand:true,
            Computerinterface:true,
            capacity:true,
          }
        },
        images: true,
        _count:true
      },
      orderBy: orderByClause,
      take: units,
      skip: page * units,
      
    });
   
   
    return NextResponse.json({data:products,total:products[0]._count});
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    res.status(500).json({ error: 'Internal error' });
  }
}