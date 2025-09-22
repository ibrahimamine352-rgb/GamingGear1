"use client"
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import { Product, Case, Cooling, Cpu, Gpu, HDD, Motherboard, Power, PreCustmizedPc, Prod, RAM } from '@/types';
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

import useCart from "@/hooks/use-cart";
import React, { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react';
import Currency from '@/components/ui/currency';
import { Button } from '@/components/ui/button';
import { Motherboard as Motherboardd } from '@/app/(storefront)/build-pc/_componenets/Motherboard';
import IconButton from '@/components/ui/icon-button';
import NormalComp from './NormalComp';
import ComponentWithCondition from './ComponentWithCondition';
import toast from 'react-hot-toast';



interface ProductFormProps {
    cases: Case[];
    cooling: Cooling[];
    cpus: Cpu[];
    diks: HDD[];
    gpus: Gpu[];
    motherboards: Motherboard[];
    powersupplies: Power[];
    rams: RAM[];
    initialData: PreCustmizedPc & Prod
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
const CustomPcTemplate: React.FC<ProductFormProps> = ({ initialData, motherboards, gpus, cpus, cases, powersupplies, cooling, diks, rams }) => {


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
    const [PcObject, setPcObject] = useState<PreCustmizedPc & Prod>(initialData);
    const [mb,setMB]=useState<Prod|undefined>(motherboards.find((e)=>e.products[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultmotherBoardId)?.products[0])
    const [cpu,setcpu]=useState<Prod|undefined>(cpus.find((e)=>e.products[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultprocessorId)?.products[0])
    const [gpu,setgpu]=useState<Prod|undefined>(gpus.find((e)=>e.products[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultgraphicCardId)?.products[0])
    const [cas,setCase]=useState<Prod|undefined>(cases.find((e)=>e.product[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultcaseId)?.product[0])
    const [power,setPower]=useState<Prod|undefined>(powersupplies.find((e)=>e.products[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultpowerSupplyId)?.products[0])
    const [cool,setCool]=useState<Prod|undefined>(cooling.find((e)=>e.product[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultcooling)?.product[0])
   const[ramConditon,setRamConditon]=useState<RamConditon>({ramType:motherboards.find((e)=>e.products[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultmotherBoardId)?.ramslots.type??"",
ramNumber:motherboards.find((e)=>e.products[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultmotherBoardId)?.ramslots.number??1})
const [SlotList,setSlotList]=useState< (RAM|undefined)[] >([])
const [errorList,setErrorList]=useState<string[]>([])
const [StockagePrimair,setStockagePrimair]=useState< Prod|undefined >(diks.find((e)=>e.product[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaulthardDiskArray[0])?.product[0])
const [StockageSecondaire,setStockageSecondaire]=useState< Prod|undefined >(diks.find((e)=>e.product[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaulthardDiskArray[1])?.product[0])
const [Total,setTotal]=useState(0)
const setSlot = (entity: RAM | undefined, key: number) => {
    const newArray = [...SlotList]; // Copying SlotList array
    newArray[key] = entity; // Updating the value at the specified index with entity
    console.log(newArray);
    setSlotList(newArray);
}
useEffect(() => {
let array:string[]=[]
SlotList.forEach((e,k)=>{
    if(e?.type.name!=ramConditon.ramType){
        array =[...array,"veuller changer la barette Ram "+k+'Votre Carte mére accepte seulement ce type de ram :'+ramConditon.ramType]
        toast.error("veuller changer la barette Ram "+k+' Votre Carte mére accepte seulement ce type de ram : '+ramConditon.ramType)
    }
})

setErrorList(array)
}, [
    ramConditon,mb,SlotList
]);
useEffect(() => {
    const cond={ramType:motherboards.find((e)=>e.products[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultmotherBoardId)?.ramslots.type??"",
    ramNumber:motherboards.find((e)=>e.products[0].id===PcObject.PreBuiltPcmodel?.pcTemplate?.defaultmotherBoardId)?.ramslots.number??1}
    let array: RAM[] = [];
    let array2: (RAM|undefined)[] = [];
    if (PcObject.PreBuiltPcmodel && PcObject.PreBuiltPcmodel.pcTemplate && PcObject.PreBuiltPcmodel.pcTemplate.defaultramIdArray) {
        array = PcObject.PreBuiltPcmodel.pcTemplate.defaultramIdArray
            .map((ra) => rams.find((e) => e.products[0].id === ra))
            .filter((e) => e !== undefined) as RAM[];
    }
    for(let i=0;i<cond.ramNumber;i++){
        if(array[i]){
            array2[i]=array[i]
        }else{
            array2[i]= undefined
        }
       
    }
  
    console.log(array)
    console.log(cond)
    setRamConditon(cond);
    setSlotList(array2)
}, []);
useEffect(()=>{
var to=0
if(mb)
to+=parseInt(mb.price.toString());
if(cpu)
to+=parseInt(cpu.price.toString());
if(gpu)
to+=parseInt(gpu.price.toString());
if(cas)
to+=parseInt(cas.price.toString());
if(power)
to+=parseInt(power.price.toString());
if(cool)
to+=parseInt(cool.price.toString());
if(StockagePrimair)
to+=parseInt(StockagePrimair.price.toString());
if(StockageSecondaire)
to+=parseInt(StockageSecondaire.price.toString());
console.log(to)
if(PcObject.PreBuiltPcmodel?.pcTemplate?.discountOnPc)
to=to-parseInt(PcObject.PreBuiltPcmodel?.pcTemplate?.discountOnPc.toString())
SlotList.map((e)=>{
    if(e){
        to+=parseInt(e.products[0].price.toString()); 
    }
})
console.log(to)
setTotal(to)
},[mb,cpu,gpu,cas,power,cool,SlotList,StockagePrimair,StockageSecondaire])
useEffect(() => {
        let list: TableData[] = []
        const mb = motherboards.find((e) => e.products[0].id === PcObject.PreBuiltPcmodel?.pcTemplate?.defaultmotherBoardId);
        list = addDataToTable(mb?.products[0], 'Carte Mére', list);
        const gpu = gpus.find((e) => e.products[0].id === PcObject.PreBuiltPcmodel?.pcTemplate?.defaultgraphicCardId);
        list = addDataToTable(gpu?.products[0], 'Carte Graphique', list);
        const cpu = cpus.find((e) => e.products[0].id === PcObject.PreBuiltPcmodel?.pcTemplate?.defaultprocessorId);
        list = addDataToTable(cpu?.products[0], 'Processeur', list);
        let ram: string[] = []
        let ramPrix = 0
        PcObject.PreBuiltPcmodel?.pcTemplate?.defaultramIdArray.forEach((ra) => {
            const Rams = rams.find((e) => e.products[0].id === ra);
            ram = [...ram, `(${Rams?.type.name} X ${Rams?.number.number} GB )`]
            if (Rams)
                ramPrix += parseInt(Rams?.products[0].price.toString())
        })
        const itemCount = countItems(ram);
        ram = []
        for (const key in itemCount) {
            ram = [...ram, `${itemCount[key]} ${key}`];
        }
        list = [
            ...list,
            {
                composant_name: ram.join(' , '),
                composant_Type: "Ram",
                composant_Destails: "",
                composant_Price: ramPrix.toString() + ' TND',
            }
        ];
        let har: string[] = []
        let harPrix = 0
        PcObject.PreBuiltPcmodel?.pcTemplate?.defaulthardDiskArray.forEach((ra) => {
            const Rams = diks.find((e) => e.product[0].id === ra);
            har = [...har, `(${Rams?.type.name} X ${Rams?.capacity.name} )`]
            if (Rams)
                harPrix += parseInt(Rams?.product[0].price.toString())
        })

        const itemCountt = countItems(har);
        har = []
        for (const key in itemCountt) {

            har = [...har, `${itemCountt[key]} ${key}`];
        }
        list = [
            ...list,
            {
                composant_name: har.join(' , '),
                composant_Type: "Stockage",
                composant_Destails: "",
                composant_Price: harPrix.toString() + ' TND',
            }
        ];
        setTableData(list)
    }, [PcObject]);

    const addDataToTable = (prod: Prod | undefined, type: string, list: TableData[]) => {
        if (prod) {
            list = [
                ...list,
                {
                    composant_name: prod.name,
                    composant_Type: type,
                    composant_Destails: "",
                    composant_Price: prod.price.toString() + ' TND',
                }
            ];
        }
        return list
    };

    function countItems(arr: string[]): { [key: string]: number } {
        const count: { [key: string]: number } = {};

        arr.forEach(item => {
            if (count[item]) {
                count[item]++;
            } else {
                count[item] = 1;
            }
        });

        return count;
    }
    const cart = useCart();

    const onAddToCart = () => {

        cart.addItem({ ...formattedproduct, number: 1 });
    }

    return (
        <div>  <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-8">
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
                       PcObject.PreBuiltPcmodel?.pcTemplate?.discountOnPc&& parseInt(PcObject.PreBuiltPcmodel?.pcTemplate?.discountOnPc.toString())?<>
                       <div className='text-xs mb-2'>Cette prix est sous une réduction </div>
                       </>:<></>
                    }
                    <div className=" mb-7 flex items-center gap-x-3">
                        <Button variant={"default"}   onClick={onAddToCart} className="flex items-center bg-purple-500 text-white hover:bg-purple-500 focus:bg-purple-500  gap-x-2">
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
                        
                         <NormalComp item={mb} motherboards={motherboards} setItem={setMB} />





                      
                    </div>
                </div>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Processeur</div>
                        
                        <NormalComp item={cpu} cpus={cpus} setItem={setcpu} />


                    </div>
                </div>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Carte Graphiue</div>
                        
                        <NormalComp item={gpu} cpus={gpus} setItem={setgpu} />


                    </div>
                </div>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Boitier</div>
                        
                        <NormalComp item={cas} cases={cases} setItem={setCase} />


                    </div>
                </div>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Boitier d&apos;alimentation</div>
                        
                        <NormalComp item={power} cpus={powersupplies} setItem={setPower} />


                    </div>
                </div>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Systeme de Refroidissement</div>
                        
                        <NormalComp item={cool} cases={cooling} setItem={setCool} />


                    </div>
                </div>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Stockage Primaire </div>
                        
                        <NormalComp item={StockagePrimair} cases={diks} setItem={setStockagePrimair} />


                    </div>
                </div>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Stockage Secondaire</div>
                        
                        <NormalComp item={StockageSecondaire} cases={diks} setItem={setStockageSecondaire} />


                    </div>
                </div>
            </div>
            
           <div className='my-3 font-bold '>Rams</div> 
            <div className='grid  grid-cols-2 md:grid-cols-4 gap-2'>
     
                        
                        <ComponentWithCondition SlotList={SlotList} setSlot={setSlot}  ramConditon={ramConditon} rams={rams}/>
     
                
            </div>
        </div>
        
    )
}

export default CustomPcTemplate