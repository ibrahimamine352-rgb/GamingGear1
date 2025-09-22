import Navbar from "@/components/front/Header";
import Main from "@/components/front/main";
import prismadb from "@/lib/prismadb";
import { MantineProvider, createTheme } from '@mantine/core';

import { format } from "date-fns";
import { Decimal } from "@prisma/client/runtime/library";
import { Product } from "@/types";
import { Metadata } from "next";
type SlidesColumn = {
  id: string
  title: string;
  imageUrl: string;
  description: string;
  url: string;
  createdAt: string;
  discount:number;
  bgUrl: string;
  mobilebgURl: string;
  descriptionColor:string;
  titleColor:string;
}



export default async function Home() {
  const slides = await prismadb.slide.findMany({
  });
  const formattedslides: SlidesColumn[] = slides.map((item) => ({
    id: item.id,
    title: item.title,
    description:item.description,
    imageUrl:item.imageUrl,
    bgUrl: item.bgUrl,
    mobilebgURl: item.mobilebgURl,
    url:item.url,
    descriptionColor:item.descriptionColor,
    titleColor:item.titleColor,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    discount:item.discount
  }));
  const featured = await prismadb.product.findMany({ 
   where :{
    isFeatured:true,
    isArchived:false,
   },
   include:{
     images:true,
     category:true,
     additionalDetails: true 
   }
 
   });
   const formattedproducts: Product[] = featured.map((item) => ({
    id: item.id,
    name: item.name,
    images:item.images,
    stock:parseInt(item.stock.toString()),
    price: parseFloat(item.price.toString()),
    dicountPrice:parseInt(item.dicountPrice.toString()),
    category: item.category,
    description:item.description,
    additionalDetails: item?.additionalDetails

  }));
 


  
  return <>
  
   <Main  slides={formattedslides} featured={formattedproducts} />
  
   </>;
}
