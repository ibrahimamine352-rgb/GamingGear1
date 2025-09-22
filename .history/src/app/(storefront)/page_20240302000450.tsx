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
const keywords = [
  // Arabic
 
  "computers",
  "laptops",
  "desktops",
  "accessories",
  "displays",
  "devices",
  "high-performance",
  "customization",
  "components",
  "graphics cards",
  "keyboards",
  "mice",
  "headsets",
  "chairs",
  "controllers",
  "equipment",
  "upgrades",
  "esports equipment",
  "settings",
  "performance improvement",
  "competitive equipment",
  "broadcasting equipment",
  "building",
  "maintenance",
  "upgrading",
  "computer accessories",
  "computer devices",
  "computer components",
  "computer software",
  "computer performance improvement",
  "offers",
  "sales",
  "special offers",
  "discounts",
  "bundles",
  "configurations",

  // French
  "ordinateurs",
  "portables",
  "bureaux",
  "accessoires",
  "affichages",
  "appareils",
  "haute performance",
  "personnalisation",
  "composants",
  "cartes graphiques",
  "claviers",
  "souris",
  "écouteurs",
  "chaises",
  "contrôleurs",
  "équipement",
  "mises à niveau",
  "matériel esports",
  "paramètres",
  "amélioration des performances",
  "équipement compétitif",
  "équipement de diffusion",
  "construction",
  "maintenance",
  "mise à niveau",
  "accessoires informatiques",
  "appareils informatiques",
  "composants informatiques",
  "logiciels informatiques",
  "amélioration des performances informatiques",
  "offres",
  "ventes",
  "offres spéciales",
  "réductions",
  "bundles",
  "configurations"
];

export const Mestadata:Metadata= {
 
    title:"Gaming Gear TN ",
    description:"Votre escale exclusive pour des PC et périphériques haut de gamme, rehaussant votre expérience informatique avec élégance et performance incomparables.",
    keywords:keywords
    
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
