
import prismadb from '@/lib/prismadb'
import PaginationControls from './_componenets/PaginationControls'
import Image from 'next/image'
import React, { useEffect } from 'react'
import ProductList from '@/components/product-list'
import { Product } from '@/types'
import { Pagination } from "@nextui-org/pagination";
import Sidebar from './_componenets/sideBar'
import { HeadsetFilters, LaptopFilters, MicFilters, MouseFilters, MousepadFilters, casesFilters, coolingFilters, cpusFilters, gpusFilters, keyboardFilters, memoriesFilters, motherboardFilters, powersuppliesFilters, screensFilters, storagesFilters } from './_componenets/Filters'
import { addCaseFitlters, addCoolingFitlters, addHardDiskFitlters, addHeadsetFitlters, addKeyboardFitlters, addLaptopFitlters, addMicFitlters, addMouseFitlters, addMousepadFitlters, addPowerFitlters, addRamFitlters, addScreenFitlters, addcpuFitlters, addgpuitlters, addmotherboardFitlters } from './_componenets/FilterFunctions'
import { Metadata } from 'next'


interface Props{
  searchParams: {  [key: string]: string | string[] | undefined  }
}
export async function generateMetadata({searchParams}:Props):Promise< Metadata> {
  try {
    // Extract parameters and generate metadata dynamically
  const search = searchParams['search'] ?? ''
  const categoryy = searchParams['categorie'] ?? ''
  if(search.length>0)
  return {
    title: search.toString(),
    description:""
  };
  if(categoryy.length>0)
  return {
    title: categoryy.toString(),
  };
  return {
    title: '',
  };
  } catch (error) {
    return {
      title: '',
    };
  }
  

};
export type HomeFilter = {
  title: String
  data: any[]
}


export interface compFilter{
  type:string,
  data:FilterList
}


export interface FilterList {
  [key: string]: { id: number; searchKey: string }[];
}

const Home = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const whereClause: Record<string, any> = {
 isArchived:false 
  };

  const page = searchParams['page'] ?? '1'
  const categoryy = searchParams['categorie'] ?? ''
  const search = searchParams['search'] ?? ''

  const sort = searchParams['sort'] ?? 'Prix : Croissant';
  const maxDt = searchParams['maxDt'] ?? '';
  const minDt = searchParams['minDt'] ?? '';
  const filterListParam = searchParams['filterList'] ?? '';
  // Use the split method to convert the string into an array of words
  let fList = undefined
  const wordList = search.toString().split(' ');
  if (filterListParam.length > 0) {
    const decodedFilterList = JSON.parse(decodeURIComponent(filterListParam.toString())) as compFilter;

    const typee = decodedFilterList.type as unknown as string
    if (decodedFilterList.data) {
      fList = decodedFilterList.data 
    
      if (typee == 'Carte Mére') {
        whereClause.motherboard = addmotherboardFitlters(fList).data
      
      }
      if (typee === "cpu") {
        whereClause.cpus = addcpuFitlters(fList).data
      }
      if (typee === "gpu") {
        whereClause.gpus = addgpuitlters(fList).data
    
      }


      if (typee === "ram") {
        whereClause.memories = addRamFitlters(fList).data
      }



      if (typee == "hardDisk") {
        whereClause.storages = addHardDiskFitlters(fList).data
      }






      if (typee == "cooling") {
        whereClause.cooling = addCoolingFitlters(fList).data
      }



      if (typee == "case") {
        whereClause.cases = addCaseFitlters(fList).data
      }



      if (typee == "power") {
        whereClause.powersupplies = addPowerFitlters(fList).data
      }
      if (typee == "screen") {
        whereClause.screens = addScreenFitlters(fList).data
      }
      if (typee == "laptop") {
        whereClause.Laptop = addLaptopFitlters(fList).data
      }

      if (typee == "keyboard") {
       whereClause.keyboard = addKeyboardFitlters(fList).data
   
      } 
      if (typee == "mic") {
        whereClause.Mic = addMicFitlters(fList).data
   
      }
      if (typee == "casque") {
        whereClause.Headset = addHeadsetFitlters(fList).data
   
      }
      if (typee == "mouse") {
        whereClause.Mouse = addMouseFitlters(fList).data
   
      }
      if (typee == "mousePad") {
        whereClause.Mousepad = addMousepadFitlters(fList).data
   
      }

     
  

    }
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
          price: 'asc', // or 'desc' depending on your preference
        };
    }
  }else{
    orderByClause = {
      price: 'asc', // or 'desc' depending on your preference
    };
  }


  let pageIndex = 1
  function isNumber(value: any): boolean {
    return typeof value === 'number';
  }
  const perpage = 12
  let totalprod = 0
  if (isNumber(parseInt(page.toString())) && parseInt(page.toString()) > 0) {
    pageIndex = parseInt(page.toString())
  } else {
    pageIndex = 1
  }
  let prods

  if (search.length > 0) {
    if (wordList.filter((i) => i != ' ').length > 0) {
      whereClause.AND = wordList.filter((i) => i != ' ').map((word) => ({
        name: {
          contains: word,
          mode: 'insensitive',
        },
      }));
    } else {
      whereClause.name = {
        contains: search.toString(),
        mode: 'insensitive',

      };
    }

  }


  if (maxDt.length > 0 && maxDt.length) {
    whereClause.price = {
      lte: parseInt(maxDt.toString()),
    };
    if (minDt.length > 0 && minDt.length) {
      whereClause.price = {
        ...(whereClause.price || {}),
        gte: parseInt(minDt.toString()),
      };
    }
  }




  if (categoryy.toString().length > 0) {

    whereClause.category = {
      name: categoryy.toString()
    }


  }

  prods = await prismadb.product.findMany({
    where: whereClause,
    include: {
      motherboard: true,
      cases: true,
      cooling: true,
      Headset: true,
      keyboard: true,
      Laptop: true,
      memories: true,
      Mic: true,
      Mouse: true,
      Mousepad: true,
      powersupplies: true,
      PreBuiltPcmodel: true,
      screens: true,
      storages: true,
      cpus: true,
      gpus: true,
      images: true,
      category: true,
      additionalDetails: true,

    },
    skip: (perpage * (pageIndex - 1)),
    take: perpage,
    orderBy: orderByClause,

  })
  totalprod = await prismadb.product.count({
    where: whereClause,
  });


  console.log(whereClause)
  const categorie = await prismadb.category.findMany({
    where: {
      products: { some: whereClause },
    },
    include:{_count:{select:{products:true}}}
    ,orderBy:{products:{_count:'desc'}}
  })

  let filters: any[] = []
  let i = 0
  if (categoryy.toString().length > 0&&prods.length===0) {
    const prou = await prismadb.product.findMany({
      where: {
       name:{
        contains:categoryy.toString()
       },
      },
      include:{  motherboard: true,
        cases: true,
        cooling: true,
        Headset: true,
        keyboard: true,
        Laptop: true,
        memories: true,
        Mic: true,
        Mouse: true,
        Mousepad: true,
        powersupplies: true,
        PreBuiltPcmodel: true,
        screens: true,
        storages: true,
        cpus: true,
        gpus: true,
        images: true,
        category: true,
        additionalDetails: true,},
      orderBy:orderByClause,
      take:1
    })



    if (prou.findIndex((e) => e.motherboard.length == 1) > -1) {
      filters[i] = await motherboardFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.cpus.length == 1) > -1) {
      filters[i] = await cpusFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.gpus.length == 1) > -1) {
      filters[i] = await gpusFilters() as unknown as HomeFilter
      i++
   
    }
    if (prou.findIndex((e) => e.Headset.length == 1) > -1) {
      filters[i] = await HeadsetFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.Laptop.length == 1) > -1) {
      filters[i] = await LaptopFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.Mic.length == 1) > -1) {
      filters[i] = await MicFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.Mouse.length == 1) > -1) {
      filters[i] = await MouseFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.Mousepad.length == 1) > -1) {
      filters[i] = await MousepadFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.cases.length == 1) > -1) {
      filters[i] = await casesFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.cooling.length == 1) > -1) {
      filters[i] = await coolingFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.keyboard.length == 1) > -1) {
      filters[i] = await keyboardFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.memories.length == 1) > -1) {
      filters[i] = await memoriesFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.powersupplies.length == 1) > -1) {
      filters[i] = await powersuppliesFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.screens.length == 1) > -1) {
      filters[i] = await screensFilters() as unknown as HomeFilter
      i++
  
    }
    if (prou.findIndex((e) => e.storages.length == 1) > -1) {
      filters[i] = await storagesFilters() as unknown as HomeFilter
      i++
  
    }
  }
  

  if (prods.findIndex((e) => e.motherboard.length == 1) > -1) {
    filters[i] = await motherboardFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.cpus.length == 1) > -1) {
    filters[i] = await cpusFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.gpus.length == 1) > -1) {
    filters[i] = await gpusFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.Headset.length == 1) > -1) {
    filters[i] = await HeadsetFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.Laptop.length == 1) > -1) {
    filters[i] = await LaptopFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.Mic.length == 1) > -1) {
    filters[i] = await MicFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.Mouse.length == 1) > -1) {
    filters[i] = await MouseFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.Mousepad.length == 1) > -1) {
    filters[i] = await MousepadFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.cases.length == 1) > -1) {
    filters[i] = await casesFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.cooling.length == 1) > -1) {
    filters[i] = await coolingFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.keyboard.length == 1) > -1) {
    filters[i] = await keyboardFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.memories.length == 1) > -1) {
    filters[i] = await memoriesFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.powersupplies.length == 1) > -1) {
    filters[i] = await powersuppliesFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.screens.length == 1) > -1) {
    filters[i] = await screensFilters() as unknown as HomeFilter
    i++

  }
  if (prods.findIndex((e) => e.storages.length == 1) > -1) {
    filters[i] = await storagesFilters() as unknown as HomeFilter
    i++

  }

  const formattedproducts: Product[] = prods.map((item) => ({
    id: item.id,
    name: item.name,
    images: item.images,
    dicountPrice:parseInt(item.dicountPrice.toString()),
    stock: parseInt(item.stock.toString()),
    price: parseFloat(item.price.toString()),
    category: item.category,
    description: item.description,
    additionalDetails: item?.additionalDetails
  }));


  const total = Math.ceil(totalprod / perpage)

  let ski = total * (pageIndex - 1)
  if (ski < 0) {
    ski = 0
  }
  let header = 'Store'
  if (categoryy.length > 0) {
    header = categoryy.toString()
  }
 

  const lfilters = filters

  return (
    <div className=' bg-[#ffffffe6]  dark:bg-[#26143aad] my-10 container rounded-lg'>


      <Sidebar hasNextPage={pageIndex < total}
        hasPrevPage={pageIndex > 1}
        pagetotal={total}
        perpage={perpage}
        selectfilterList={fList}
        pageindex={pageIndex}
        totalprod={totalprod}
        header={header}
        category={categoryy.toString()}
        filter={filters}
        isloadingg={false}
        categories={categorie}
        titlee={search.toString()}
        items={formattedproducts} sort={sort.toString()} />


    </div>
  )
}
export default Home