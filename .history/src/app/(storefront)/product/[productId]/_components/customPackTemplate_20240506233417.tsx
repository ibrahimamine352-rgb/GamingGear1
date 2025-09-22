"use client"
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import { Product, Case, Cooling, Cpu, Gpu, HDD, Motherboard, Power, PreCustmizedPc, Prod, RAM, ProdCol } from '@/types';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import Image from 'next/image';

import useCart, { CartItem } from "@/hooks/use-cart";
import React, { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react';
import Currency from '@/components/ui/currency';
import { Button } from '@/components/ui/button';
import { Motherboard as Motherboardd } from '@/app/(storefront)/build-pc/_componenets/Motherboard';
import IconButton from '@/components/ui/icon-button';
import NormalComp from './NormalComp';
import ComponentWithCondition from './ComponentWithCondition';
import toast from 'react-hot-toast';
import { Image as IImage } from '@prisma/client';



interface ProductFormProps {
    initialData: Product & {
        images: IImage[]
        PackProduct:{
            id:number,
            Clavier: ProdCol[],
            Headset:ProdCol[],
            Mic:ProdCol[],
            Mouse:ProdCol[],
            MousePad:ProdCol[],
            Screen:ProdCol[],   
            Speaker:ProdCol[], 
            Manette:ProdCol[], 
            Chair:ProdCol[],  
            Camera:ProdCol[],
            DefaultClavier:String
            DefaultMouse:String
            DefaultMousePad:String
            DefaultMic:String
            DefaultHeadset:String
            DefaultCamera:String
            DefaultScreen:String
            DefaultSpeaker :String
            DefaultManette:String
            DefaultChair   :String
            discountOnPack: number
        }[]
    
       
      } ;
}
interface TableData {
    composant_Type: string,
    composant_name: string,
    composant_Destails: string,
    composant_Price: string,
}
interface AdvancedTableData {
    composant_Type: string,
    composant_List: {
        composant_name: string,
        composant_Destails: string,
        composant_Price: string,
    } 
}
export interface RamConditon{
    ramType:String,
    ramNumber:number
}
const CustomPackTemplate: React.FC<ProductFormProps> = ({ initialData}) => {


    const calculePrix = () => {
        return 5
    }
    const formattedproduct: Product = {
        id: initialData?.id,
        name: initialData?.name,
        images: initialData?.images,
        dicountPrice: parseFloat(initialData.dicountPrice.toString()),
        stock: parseInt(initialData.stock.toString()),
        price: calculePrix(),
        description: initialData.description,
        additionalDetails: [],
        category: {
            id: '',
            name: ''
        }
    }
    const [TableData, setTableData] = useState<TableData[]>([]);
    const [AdvancedTableData, setAdvancedTableData] = useState<AdvancedTableData[]>([]);
  
const [errorList,setErrorList]=useState<string[]>([])
const [Total,setTotal]=useState(0)


    return (
        <div> zzz <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-8">
            <div>
                {parseInt(initialData.dicountPrice.toString()) > 0 ? <>
                    <div className=" w-full flex justify-end  ">
                        <Image src={'/images/remise.png'} className="dark:invisible absolute  z-20 -mr-6 rotate-[25deg] ml-auto" alt="" width={100} height={100} />
                        <Image src={'/images/remise-dark.png'} className="invisible dark:visible absolute  z-20 -mr-6 rotate-[25deg] ml-auto" alt="" width={100} height={100} />

                    </div>
                </> : <></>}
                <Gallery images={initialData.images} />
            </div>

            <div className="mt-10 md:mx-0 sm:mx-0 lg:mx-20 col-span-2 sm:mt-16 sm:px-0 lg:mt-0">
                <div>
                    <h1 className="text-3xl font-bold ">{formattedproduct.name}</h1>

                    <hr className="my-4" />
                    <div className="flex flex-col gap-y-6">
                        <div className="flex items-center gap-x-4">
                            <h3 className="font-semibold "></h3>
                            <p>
                                {formattedproduct.description}
                            </p>

                        </div>
                    </div>   
                    <Table className='border my-3  border-purple-500 rounded-lg' >

                        <TableBody>
                            {TableData.map((invoice) => (
                                <TableRow className='hover:bg-purple-100 dark:hover:bg-purple-900/20 ' key={invoice.composant_name}>
                                    <TableCell className="font-medium">{invoice.composant_Type}</TableCell>
                                    <TableCell>{invoice.composant_name}</TableCell>
                                    <TableCell className="text-right">{invoice.composant_Price}</TableCell>
                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>
                    
                    <div className="mt-3 flex items-end justify-between">
                        <div className="flex items-center flex-col text-center  space-y-0 text-2xl  mt-auto  text-[#673ab6] dark:text-[#ad7dff]">
                            {formattedproduct?.dicountPrice > 0 ? <><span className=" line-through mt-3 text-gray-400 dark:text-gray-400 border-red-400 border-opacity-30 "><Currency value={formattedproduct?.dicountPrice} /> </span>  </> : <></>} <b className="mt-2"><Currency value={Total} /> </b>
                        </div>
                    </div>
                    {
                       initialData?.PackProduct[0].discountOnPack&& parseInt(initialData?.PackProduct[0].discountOnPack.toString())?<>
                       <div className='text-xs mb-2'>Cette prix est sous une réduction </div>
                       </>:<></>
                    }
                    <div className=" mb-7 flex items-center gap-x-3">
                        <Button variant={"default"}  className="flex items-center bg-purple-500 text-white hover:bg-purple-500 focus:bg-purple-500  gap-x-2">
                           Ajouter au panier
                            <ShoppingCart size={20} />
                        </Button>
                    </div>
                </div>

            </div>
        </div>


            <div className='grid  grid-cols-2 md:grid-cols-6 gap-2'>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        <div className='w-full text-center font-bold mb-3'>Carte mére </div>
                        
                         {/* <NormalComp item={mb} motherboards={motherboards} setItem={setMB} /> */}





                         </div>
                    </div>
                </div>
        </div>
        
    )
}

export default CustomPackTemplate