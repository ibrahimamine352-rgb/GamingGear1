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
                    </div>    <div className="mt-3 flex items-end justify-between">
                        <div className="flex items-center flex-col text-center  space-y-0 text-2xl my-2 mt-auto  text-[#673ab6] dark:text-[#ad7dff]">
                            {formattedproduct?.dicountPrice > 0 ? <><span className=" line-through mt-3 text-gray-400 dark:text-gray-400 border-red-400 border-opacity-30 "><Currency value={formattedproduct?.dicountPrice} /> </span>  </> : <></>} <b className="my-2"><Currency value={formattedproduct?.price} /> </b>
                        </div>
                    </div>
                    <Table>

                        <TableBody>
                            {TableData.map((invoice) => (
                                <TableRow key={invoice.composant_name}>
                                    <TableCell className="font-medium">{invoice.composant_Type}</TableCell>
                                    <TableCell>{invoice.composant_name}</TableCell>
                                    <TableCell className="text-right">{invoice.composant_Price}</TableCell>
                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                    <div className="mt-10 flex items-center gap-x-3">
                        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
                            Add To Cart
                            <ShoppingCart size={20} />
                        </Button>
                    </div>
                </div>

            </div>
        </div>


            <div className='md:grid  grid-cols-5 gap-2'>
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div>
                        <div className='w-full text-center font-bold mb-3'>Carte mére </div>
                        
                         <NormalComp item={mb} motherboards={motherboards} setItem={setMB} />





                      
                    </div>
                </div>
                <div className='border p-3 rounded-lg border-purple-500 w-full'>
                    <div>
                        Processeur
                    </div>
                </div>
            </div>



        </div>
    )
}

export default CustomPcTemplate