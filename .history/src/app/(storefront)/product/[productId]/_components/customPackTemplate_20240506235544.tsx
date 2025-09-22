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
import NormalComp2 from './NormalComp2';



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

    const [keyboardList, setkeyboardList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Clavier
        ? initialData?.PackProduct[0].Clavier
        : []);
        const [MouseList, setMouseList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Mouse
          ? initialData?.PackProduct[0].Mouse
          : []);
      
      const [MousepadsList, setMousepadsList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].MousePad
          ? initialData?.PackProduct[0].MousePad
          : []);
      
      const [MicsList, setMicsList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Mic
          ? initialData?.PackProduct[0].Mic
          : []);
      
      const [HeadsetsList, setHeadsetsList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Headset
          ?initialData?.PackProduct[0].Headset
          : []);
      
      const [CamerasList, setCamerasList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Camera
          ? initialData?.PackProduct[0].Camera
          : []);
      
      const [screensList, setscreensList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Screen
          ? initialData?.PackProduct[0].Screen
          : []);
      
      const [HautparleursList, setHautparleursList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Speaker
          ?initialData?.PackProduct[0].Speaker
          : []);
      
      const [ManettesList, setManettesList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Manette
          ?  initialData?.PackProduct[0].Manette
          : []);
      
      const [ChaisegamingsList, setChaisegamingsList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Chair
          ? initialData?.PackProduct[0].Chair
          : []);
      
      console.log(initialData?.PackProduct[0].discountOnPack)
    
      const [defaultKeyboard,setDefaultKeyboard]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Clavier.find((e)=>e.id==initialData?.PackProduct[0].DefaultClavier)??undefined)
      const [defaultMouse,setDefaultMouse]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Mouse.find((e)=>e.id==initialData?.PackProduct[0].DefaultMouse)??undefined )
      const [defaultMousePad,setDefaultMousePad]= useState<ProdCol|undefined>(initialData?.PackProduct[0].MousePad.find((e)=>e.id==initialData?.PackProduct[0].DefaultMousePad)??undefined )
      const [defaultMics,setDefaultMics]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Mic.find((e)=>e.id==initialData?.PackProduct[0].DefaultMic)??undefined  )
      const [defaultHeadset,setDefaultHeadset]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Headset.find((e)=>e.id==initialData?.PackProduct[0].DefaultHeadset)??undefined  )
      const [defaultCamera,setDefaultCamera]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Camera.find((e)=>e.id==initialData?.PackProduct[0].DefaultCamera)??undefined )
      const [defaultScreen,setDefaultScreen]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Screen.find((e)=>e.id==initialData?.PackProduct[0].DefaultScreen)??undefined  )
      const [DefaultSpeaker,setDefaultSpeDefaultSpeaker]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Speaker.find((e)=>e.id==initialData?.PackProduct[0].DefaultSpeaker)??undefined )
      const [DefaultManette,setDefaultSpeDefaultManette]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Manette.find((e)=>e.id==initialData?.PackProduct[0].DefaultManette)??undefined )
      const [DefaultChair,setDefaultSpeDefaultChair]= useState<ProdCol|undefined>(initialData?.PackProduct[0].Chair.find((e)=>e.id==initialData?.PackProduct[0].DefaultChair)??undefined )
     
    
    
      const [total,setTotal]=useState(initialData?.price??0)


    return (
        <div> <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-8">
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
                            {formattedproduct?.dicountPrice > 0 ? <><span className=" line-through mt-3 text-gray-400 dark:text-gray-400 border-red-400 border-opacity-30 "><Currency value={formattedproduct?.dicountPrice} /> </span>  </> : <></>} <b className="mt-2"><Currency value={total} /> </b>
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


            <div className='grid mt-5 grid-cols-2 md:grid-cols-6 gap-2'>
                {defaultKeyboard?<>
                    <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        <div className='w-full text-center font-bold mb-3'>Clavier</div>
                        
                         <NormalComp2 item={defaultKeyboard} motherboards={keyboardList} setItem={setDefaultKeyboard} />





                         </div>
                    </div>
                </>:<></>}
                
                </div>
                
        </div>
        
    )
}

export default CustomPackTemplate