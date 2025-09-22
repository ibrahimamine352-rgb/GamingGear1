"use client"
import prismadb from '@/lib/prismadb'
import axios from 'axios'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from '@/components/ui/search'
import Container from '@/components/ui/container'
import Skeleton from '@/components/ui/skeleton'
import SearchComponent from '@/components/search-filters/motherboard/motherboard-search'

import { Filter, ProfileType, filterItem } from '../page'
import ProductCard from '@/components/ui/product-card'
import Image from 'next/image'
import { Product } from "@/types";
import IconButton from '@/components/ui/icon-button'
import { Expand, ShoppingCart, Trash } from 'lucide-react'
import usePreviewModal from '@/hooks/use-preview-modal'
import useCart from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import Currency from '@/components/ui/currency'
import { Fragment } from 'react'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Pagination } from '@nextui-org/pagination'
import { AllProductsCompatibility } from './comps'
import { Motherboard } from './Motherboard'
import { MemoryFrequency, MemoryNumber, MemoryType, RamSlots } from '@prisma/client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from "react-hot-toast"
import { get } from 'http'
type checkItem = {
    id: number,
    searchKey: string
}

function classNames(...classes: (string | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}
type SetRams = (callback: (prevRams: Array<Memory | null>) => Array<Memory | null>) => void;

type m = {
    frequency: MemoryFrequency,
    number: MemoryNumber
    type: MemoryType
}
export type Memory = Product & {
    memories: m[]

}
type reslt = {
    data: Memory[]
    total: number
}
export type checkItemGroupsRam = {
    memoryFrequency: checkItem[],
    memoryMarque: checkItem[],
    memoryNumber: checkItem[],
    memoryType: checkItem[],
}

type YourComponentProps = {
    rams: (Memory | null)[]
    setRams: SetRams

    selectedCompatibility: AllProductsCompatibility | null
    setMotherboardId: (values: Product) => void;
    motherboardId: Product | undefined,
    profiles: ProfileType[],
    setCompatibility: (value: Record<string, { message: string; error: boolean }>) => void
    memoryMarque: Filter
    memoryFrequency: Filter
    memoryNumber: Filter
    memoryType: Filter
    ramSlotNumber:number
   ramSlotType:string
};
export const Ram: React.FC<YourComponentProps> = (props: {
      removeFeature:(featureName:string) => void;
        addFeature:(featureName:string, value:any)=> void;
        selectedFeatures:SelectedFeatures,
    setRams: SetRams
    rams: (Memory | null)[]
    selectedCompatibility: AllProductsCompatibility | null
    setMotherboardId: (values: Product) => void;
    motherboardId: Product | undefined,
    profiles: ProfileType[],
    ramSlotNumber:number
    ramSlotType:string
    memoryMarque: Filter
    memoryFrequency: Filter
    memoryNumber: Filter
    memoryType: Filter
    setCompatibility: (value: Record<string, { message: string; error: boolean }>) => void
}) => {
    const [data, setData] = useState<Memory[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterList, setFilterList] = useState<checkItemGroupsRam>({
        memoryFrequency: [],
        memoryMarque: [],
        memoryNumber: [],
        memoryType: [],
    })
    const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000]);
    const [compatible, setcompatible] = useState(false);

    const [selectedSort, setSelectedSort] = useState('Prix : Croissant');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTime, setSearchTime] = useState(0);
    const sortOptions = [
        { name: 'Les plus populaires', href: '#', current: selectedSort === 'Les plus populaires' },
        { name: 'Les plus récents', href: '#', current: selectedSort === 'Les plus récents' },
        { name: 'Prix : Croissant', href: '#', current: selectedSort === 'Prix : Croissant' },
        { name: 'Prix : Décroissant', href: '#', current: selectedSort === 'Prix : Décroissant' },
    ];
    const [total, setTotal] = useState(0)
    const fetchData = async () => {
        try {
            setLoading(true);
            const encodedFilterList = encodeURIComponent(JSON.stringify(filterList));
            const startTime = performance.now();
            // Make a GET request with the encoded filterList in the URL
            const response = await fetch(`/api/memory/component?q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`);
            const dataa = await response.json() as reslt;
            const endTime = performance.now();

            // Calculate the time taken
            const timeTaken = ((endTime - startTime) / 1000);
            setSearchTime(timeTaken)

            setData(dataa.data);
            setTotalPages(dataa.total);
            setLoading(false);
            console.log(dataa);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    };
    // Function to handle checkbox change
    const handleCheckboxChange = (filterKey: keyof checkItemGroupsRam, value: string) => {
        setFilterList((prevFilterList) => {
            const existingIndex = prevFilterList[filterKey].findIndex((item) => item.searchKey === value);

            if (existingIndex !== -1) {
                // If the item exists, remove it from the list
                prevFilterList[filterKey].splice(existingIndex, 1);
            } else {
                // If the item doesn't exist, add it to the list
                prevFilterList[filterKey].push({ id: Date.now(), searchKey: value });
            }

            return { ...prevFilterList };
        });
        console.log(filterList)
    };

    const router = useRouter();

    const handleClick = (id: any) => {
        router.push(`/product/${id}`);
    };

    const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();


    };

    const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();

    };


    const handleSortClick = (name: React.SetStateAction<string>) => {
        setSelectedSort(name);
        // Add any additional logic you need when a sort option is clicked
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, selectedSort]);
    useEffect(() => {
        fetchData();
    }, []);

    function haveCommonElement<T>(set1: T[], array2: T[]): boolean {
        const array1 = Array.from(set1);

        for (const item of array1) {
            if (array2.includes(item)) {
                return true;
            }
        }

        return false;
    }
    const checkcompatibility = (Product: Product) => {
        const mb = props.motherboardId
        if (mb) {
            const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == mb.id))

            const PProfiles = props.profiles.filter((e) => e.RAMs.find((ee) => ee.Components.find((zz) => zz.productId == Product.id)))

            if (haveCommonElement(MProfiles, PProfiles)) {
                return true
            }
            return false
        }

        return true
    }
    const [openDialog, steOpenDialog] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const [openedramSlot, setopenedramSlot] = useState(0)


    useEffect(() => {


        const updates: Record<string, { message: string; error: boolean }> = {};
        const data:string[] = []
        if (props.motherboardId) {
            props.rams.map((e, k) => {
                if (e != null) {
                    let comp = false
                    let message = "Veuillez sélectionner au moins une barrette RAM"
                  
                        if (e.memories[0].type.name === props.ramSlotType) {
                            message = 'Compatible'
                            comp = true
                        } else {
                            message = props.ramSlotType + ' à '+k+' est requis'
                            comp = false
                        }
                    data.push(message)
                    
                }
            })
        }
        if(data.length>0){
               const newdata=data.filter((e)=>e!='Compatible')
               if(newdata.length==0){
                updates['ramCompatibility'] = { message: 'Compatible', error: false };
               }else{
                updates['ramCompatibility'] = { message: data.join(""), error: true };
               }
        }else{
            updates['ramCompatibility'] = { message: 'Veuillez sélectionner au moins une barrette RAM', error: true };
        }
        props.setCompatibility(updates);
    }, [props.rams])
    const addEmptyCase = () => {
        props.setRams((prevRams: (Memory | null)[]) => [
            ...prevRams,
            null
        ]);
    };

    const removeEmptyCase = () => {
        const indexToRemove = props.rams.findLastIndex((item) => item === null);
        if (indexToRemove !== -1) {
            props.setRams((prevRams: (Memory | null)[]) => {
                const updatedArray = [...prevRams];
                updatedArray.splice(indexToRemove, 1);
                return updatedArray;
            });
        }
    };


    const add2EmptyCase = () => {
        props.setRams((prevRams: (Memory | null)[]) => [
            ...prevRams,
            null,
            null
        ]);
    };
    const updateCase = (index: number, item: Memory | null) => {
        props.setRams((prevRams: Array<Memory | null>) => {
            const updatedArray = [...prevRams];
            updatedArray[index] = item;
            return updatedArray;
        });
    };
    const updateonecasefortwocase = (index: number, item: Memory | null) => {
        props.setRams((prevRams: Array<Memory | null>) => {
            const updatedArray = [...prevRams, null];
            updatedArray[index] = item;
            console.log(item)
            return updatedArray;
        });

        const updatedArray = [...props.rams, null];
        updatedArray[index] = item;
        return updatedArray
    };
    const updatewithremove2case = (index: number, item: Memory | null) => {

        props.setRams((prevRams: Array<Memory | null>) => {
            const updatedArray = [...prevRams];
            updatedArray[index] = item;
            const indexToRemove = updatedArray.indexOf(null);
            if (indexToRemove !== -1) {
                updatedArray.splice(indexToRemove, 1);
            }
            return updatedArray;
        });
    }
    const remove2CaseProduct = (index: number) => {
        const updatedArray = [...props.rams];
        updatedArray[index] = null;
        updatedArray[index + 1] = null;
        props.setRams((prevRams: (Memory | null)[]) => updatedArray);
    };

    const is2caseProduct = (item: Memory) => extractLesserNumber(item?.name) === 2;

    const remove2caseProduct = (index: number) => {
        const updatedArray = [...props.rams];
        updatedArray[index] = null;
        updatedArray[updatedArray.length - 1] = null;
        props.setRams((prevRams: (Memory | null)[]) => updatedArray);
    };


   
    const updateElementAtIndex = (ind: number, newVe: Memory | null) => {
        console.log(ind)
        const index = ind;
        const newValue = newVe;
        const prvprod = props.rams[index];

        if (newValue === null) {
            if (prvprod === null) {
                // Leave empty
            } else if (prvprod && is2caseProduct(prvprod)) {
                // Add an empty case after updating if the product has 2 RAM bars
                updateCase(index, null);
                addEmptyCase();
            } else {
                // Just update the element to null
                updateCase(index, null);
            }
        } else if (prvprod === null) {
            if (is2caseProduct(newValue)) {
                // Update with the new value and remove an empty case if available
                if (props.rams.filter((e) => e === null).length >= 2) {
                    updatewithremove2case(index, newValue);
                    toast.success('Ce produit a 2 barrettes RAM');
                } else {
                    if (prvprod && is2caseProduct(prvprod) && !is2caseProduct(newValue)) {
                        // Handle the case when transitioning from a 2-case product to a 1-case product
                        updatewithremove2case(index, newValue);
                    }
                    toast.error(
                        'Ce produit a 2 barrettes RAM, veuillez libérer un autre emplacement RAM.1'
                    );
                }
            } else {
                // Update with the new value
                updateCase(index, newValue);
            }
        } else {
            if (prvprod && is2caseProduct(prvprod) && !is2caseProduct(newValue)) {
                // Handle the case when transitioning from a 2-case product to a 1-case product
                updateonecasefortwocase(index, newValue);
            } else {
                if (props.rams.filter((e) => e === null).length >= 1) {
                    // Update with the new value and remove an empty case if available
                    updateCase(index, newValue);
                    toast.success('Ce produit a 2 barrettes RAM');
                    console.log(props.rams);
                } else if (prvprod && is2caseProduct(prvprod)) {
                    // Update with the new value if the previous product has 2 RAM bars
                    updateCase(index, newValue);
                } else {
                    if (
                        prvprod &&
                        !is2caseProduct(prvprod) &&
                        !is2caseProduct(newValue)
                    ) {
                        // Update with the new value
                        updateCase(index, newValue);
                    } else {
                        toast.error(
                            'Ce produit a 2 barrettes RAM, veuillez libérer un autre emplacement RAM.2'
                        );
                    }
                }
            }
        }
    };




    function extractLesserNumber(memoryString: string): number | null {
        const memoryStringWithoutSpaces = memoryString.replace(/\s/g, '')
        // Remove all spaces
        const regex = /\b(\d+)X(\d+)/i;
        const match = memoryStringWithoutSpaces.match(regex);

        if (match != null) {
            const firstNumber = parseInt(match[1], 10);
            const secondNumber = parseInt(match[2], 10);

            return Math.min(firstNumber, secondNumber);
        }

        return null;
    }


    useEffect(() => {
        if (props.rams) {

            const filteredRams = props.rams.filter((e) => e != null);

            if (props.ramSlotNumber === 2) {
                // Initialize props.rams with two null values


                let n = 0;
                let i = 0;
                let array1: (Memory | null)[] = []
                // Distribute products with 2 RAM bars
                filteredRams.forEach((it) => {
                    if (it && is2caseProduct(it) && n < 2) {
                        n = n + 2;
                        array1[i] = it
                        i++
                        return
                    }
                });

                // Distribute products with 1 RAM bar
                filteredRams.forEach((it) => {
                    if (it && !is2caseProduct(it) && n < 2) {
                        n = n + 1;
                        array1[i] = it
                        i++;
                    }
                });
                console.log(i)
                if (i == 0) {
                    n = 1

                }
                for (let Xy = i; Xy < 3 - n; Xy++) {
                    array1[Xy] = null
                    console.log(array1)
                }
                props.setRams(() => {
                    console.log(array1)
                    return [...array1]
                });
            } else if (props.ramSlotNumber === 4) {


                let n = 0;
                let i = 0;
                let array1: (Memory | null)[] = []
                // Distribute products with 2 RAM bars
                filteredRams.forEach((it) => {
                    if (it && is2caseProduct(it) && n < 4) {
                        n = n + 2;
                        array1[i] = it
                        i++
                        return
                    }
                });

                // Distribute products with 1 RAM bar
                filteredRams.forEach((it) => {
                    if (it && !is2caseProduct(it) && n < 4) {
                        n = n + 1;
                        array1[i] = it
                        i++;
                    }
                });
                for (let Xy = i; Xy < 5 - n; Xy++) {
                    array1[Xy] = null

                }

                props.setRams(() => {
                    return [...array1]
                });
            }
        }

    }, [props.ramSlotNumber, props.motherboardId]);


    const ramCompatibility = (mem: Memory, index: number) => {



        let comp = false
        let message = "Veuillez sélectionner au moins une barrette RAM"
        const motherboardId =props.motherboardId
        if(motherboardId){
            const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id));
            if (mem.memories[0].type.name === props.ramSlotType) {
                const RProfiles = props.profiles.filter((xe) => xe.RAMs.find((ee) => ee.Components.find((re)=>re.productId===mem.id) ));
                 if(haveCommonElement(MProfiles, RProfiles)){
                    message = 'Compatible'
                    comp = true
                 }else{
                    message = 'Non Compatible'
                    comp = false
                 }
               
                    
                } else {
                    if(props.ramSlotType ==''){
                        message = 'chargement en cours'
                        comp = false
                    }else{
                        message = 'Barrette RAM ' + props.ramSlotType + ' est requis'
                        comp = false
                    }
                  
                }
            }
            return {
                comp,
                message
            }
        
       
      
    }

    return (
        <div>
            {
                props.motherboardId == null ? <>
                    <Card className="m-3">
                        <CardContent>
                            <div className='flex lg:flex-row flex-col '>
                                <button onClick={() => steOpenDialog(true)} className='lg:w-1/5 w-full min-w-md:max-w-lg  m-3 bg-transparent border-transparent hover:bg-transparent hover:border-transparent '>
                                    <Card className="   ">
                                        <CardHeader>
                                            <CardTitle className='text-center'>Ram
                                                <p className='text-xs text-[#885bd7] p-1'>(*Obligatoire)</p></CardTitle>
                                        </CardHeader>
                                        <CardContent>



                                            <div className='flex align-middle items-center justify-center'>


                                                <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 60 60" width="100" height="100">
                                                    <g>
                                                        <g>
                                                            <path d="M39.145,3.103c-1.244,0.299-2.242,1.296-2.542,2.541c-0.293,1.215,0.051,2.461,0.922,3.331
			c0.667,0.667,1.552,1.024,2.476,1.024c0.283,0,0.57-0.033,0.855-0.103c1.244-0.3,2.242-1.297,2.541-2.54
			c0.293-1.215-0.052-2.46-0.922-3.331C41.605,3.155,40.361,2.81,39.145,3.103z M41.453,6.889c-0.124,0.513-0.551,0.94-1.065,1.064
			C39.846,8.082,39.319,7.94,38.94,7.56c-0.38-0.38-0.522-0.907-0.392-1.448c0.124-0.514,0.552-0.941,1.065-1.064
			C39.744,5.016,39.874,5,40.001,5c0.399,0,0.772,0.152,1.06,0.439C41.44,5.819,41.583,6.347,41.453,6.889z"/>
                                                            <path d="M36.603,52.644c-0.293,1.215,0.051,2.461,0.922,3.331c0.667,0.667,1.552,1.024,2.476,1.024
			c0.283,0,0.57-0.033,0.855-0.103c1.244-0.3,2.242-1.297,2.541-2.54c0.293-1.215-0.052-2.46-0.922-3.331
			c-0.87-0.869-2.114-1.214-3.33-0.923C37.901,50.401,36.903,51.398,36.603,52.644z M40.001,52c0.399,0,0.772,0.152,1.06,0.439
			c0.379,0.38,0.522,0.907,0.392,1.449c-0.124,0.513-0.551,0.94-1.065,1.064c-0.542,0.127-1.069-0.012-1.448-0.393
			c-0.38-0.38-0.522-0.907-0.392-1.448c0.124-0.514,0.552-0.941,1.065-1.064C39.744,52.016,39.874,52,40.001,52z"/>
                                                            <path d="M43.405,0H27.5v1c0,1.103-0.897,2-2,2s-2-0.897-2-2V0h-3h-2h-5v5h2v50h-2v5h5h2h3v-1c0-1.103,0.897-2,2-2s2,0.897,2,2v1
			h15.905c1.707,0,3.095-1.389,3.095-3.096V3.096C46.5,1.389,45.111,0,43.405,0z M18.5,58h-3v-1h2V3h-2V2h3V58z M44.5,11h-5v2h5v1
			h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v7.904
			c0,0.604-0.491,1.096-1.095,1.096H29.374c-0.445-1.724-2.013-3-3.874-3s-3.428,1.276-3.874,3H20.5V2h1.126
			c0.445,1.724,2.013,3,3.874,3s3.428-1.276,3.874-3h14.031C44.009,2,44.5,2.491,44.5,3.096V11z"/>
                                                            <path d="M32.5,6h-2v2h-1V6h-2v2h-1V6h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2V8h-2V6z M32.5,14h-8v-4h8V14z" />
                                                            <path d="M32.5,42h-2v2h-1v-2h-2v2h-1v-2h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2v-8h-2V42z M32.5,50h-8v-4h8V50z" />
                                                            <path d="M32.5,24h-2v2h-1v-2h-2v2h-1v-2h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2v-8h-2V24z M32.5,32h-8v-4h8V32z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                        </CardContent></Card>
                                </button>


                                <Card className="lg:w-4/5  w-full min-w-md:max-w-lg justify-center flex align-middle  lg:flex-row flex-col items-center m-3">
                                    <CardContent className='p-0 w-full h-full'>
                                        {
                                            props.rams && props.rams[0] != null ? <>       <div className="dark:bg-[#321642d0] bg-[#ffffffe6] flex  justify-between group   md:flex-row flex-col  items-center rounded-xl space-x-3">
                                                {/* Image & actions */}
                                                <div className="flex-shrink-0">
                                                    <div className="aspect-square rounded-xl  mt-3  bg-gray-100 ml-3 dark:bg-transparent relative" style={{ height: '150px' }}>
                                                        <Image
                                                            src={props.rams[0].images?.[0]?.url}
                                                            alt=""
                                                            fill
                                                            className="aspect-square object-cover rounded-md h-full w-full"
                                                        />
                                                        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
                                                            {/* Add your actions or content here */}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Description */}
                                                <div className="flex-grow  p-3">
                                                    <p className="font-semibold text-sm ">{props.rams[0].name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {showFullDescription ? props.rams[0].description : `${props.rams[0].description.slice(0, 100)}...`}
                                                        {props.rams[0].description.length > 100 && (
                                                            <span className=" font-bold  cursor-pointer" onClick={toggleDescription}>
                                                                {showFullDescription ? ' See Less' : ' See More'}
                                                            </span>
                                                        )}
                                                    </p>  </div>
                                                {/* Compatiblité */}
                                                {props.selectedCompatibility ? <>
                                                    <div className="w-4/5">
                                                        <div className='font-bold my-2 text-sm'>
                                                            Compatibilité:
                                                        </div>

                                                        <div className="text-left  grid  text-xs max-w-screen-md mx-auto border border-gray-300 rounded mb-3 mr-3">
                                                            <div className="p-1 pl-3 border-b  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                    Processeur :
                                                                </p>
                                                                <p className={props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                    {props.selectedCompatibility.Compatibility.processorCompatibility.message}
                                                                </p>
                                                            </div>

                                                            <div className="p-1 pl-3 border-b  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.ramCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                    Ram  :
                                                                </p>
                                                                <p className={props.selectedCompatibility.Compatibility.ramCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                    {props.selectedCompatibility.Compatibility.ramCompatibility.message}
                                                                </p>
                                                            </div>

                                                            <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                    Disque dur compatibilité :
                                                                </p>
                                                                <p className={props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                    {props.selectedCompatibility.Compatibility.hardDiskCompatibility.message}
                                                                </p>
                                                            </div>

                                                            <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                    Boîte d&apos;alimentation compatibilité :
                                                                </p>
                                                                <p className={props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                    {props.selectedCompatibility.Compatibility.powerCompatibility.message}
                                                                </p>
                                                            </div>

                                                            <div className="p-1 pl-3  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                    Boîtier compatibilité :
                                                                </p>
                                                                <p className={props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                    {props.selectedCompatibility.Compatibility.caseCompatibility.message}
                                                                </p>
                                                            </div>
                                                        </div>




                                                    </div>
                                                </> : <></>}
                                                {/* Price & Review */}
                                                <div className="flex-shrink-0  p-3">
                                                    <div className=' text-center flex flex-col   '>
                                                        <div className='p-3 '>
                                                            <Currency value={props.rams[0].price} />
                                                        </div>
                                                        <Button
                                                            disabled={loading}
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => updateElementAtIndex(0, null)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                        <Button onClick={() => steOpenDialog(!openDialog)}>Changer</Button>
                                                        <a href="zz" className='underline mt-2' target='_blank'>
                                                            Voir en store
                                                        </a>

                                                    </div>

                                                </div>

                                            </div></> : <>   <div onClick={() => steOpenDialog(!openDialog)} className='color-[#885bd7]  cursor-pointer  w-full h-full flex justify-center items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} version="1.1" x="0px" y="0px" viewBox="0 0 44 55" ><g><path fill="#885bd7" d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z" /></g></svg>


                                            </div>
                                            </>
                                        }



                                    </CardContent></Card>
                            </div>
                        </CardContent>
                    </Card>

                </> : <>

                    {props.rams.map((prod, k) => (
                        <>
                            <Card className="m-3">
                                <CardContent>
                                    <div className='flex lg:flex-row flex-col '>
                                        <button onClick={() => steOpenDialog(true)} className='lg:w-1/5 w-full min-w-md:max-w-lg  m-3 bg-transparent border-transparent hover:bg-transparent hover:border-transparent '>
                                            <Card className="   ">
                                                <CardHeader>
                                                    <CardTitle className='text-center'>Emplacement Ram ({k + 1})
                                                        {props.rams.findIndex((e) => e !== null) != -1 ? <></> : <><p className='text-xs text-[#885bd7] p-1'>(*Obligatoire au moin 1)</p></>}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>



                                                    <div className='flex align-middle items-center justify-center'>


                                                        <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 60 60" width="100" height="100">
                                                            <g>
                                                                <g>
                                                                    <path d="M39.145,3.103c-1.244,0.299-2.242,1.296-2.542,2.541c-0.293,1.215,0.051,2.461,0.922,3.331
        c0.667,0.667,1.552,1.024,2.476,1.024c0.283,0,0.57-0.033,0.855-0.103c1.244-0.3,2.242-1.297,2.541-2.54
        c0.293-1.215-0.052-2.46-0.922-3.331C41.605,3.155,40.361,2.81,39.145,3.103z M41.453,6.889c-0.124,0.513-0.551,0.94-1.065,1.064
        C39.846,8.082,39.319,7.94,38.94,7.56c-0.38-0.38-0.522-0.907-0.392-1.448c0.124-0.514,0.552-0.941,1.065-1.064
        C39.744,5.016,39.874,5,40.001,5c0.399,0,0.772,0.152,1.06,0.439C41.44,5.819,41.583,6.347,41.453,6.889z"/>
                                                                    <path d="M36.603,52.644c-0.293,1.215,0.051,2.461,0.922,3.331c0.667,0.667,1.552,1.024,2.476,1.024
        c0.283,0,0.57-0.033,0.855-0.103c1.244-0.3,2.242-1.297,2.541-2.54c0.293-1.215-0.052-2.46-0.922-3.331
        c-0.87-0.869-2.114-1.214-3.33-0.923C37.901,50.401,36.903,51.398,36.603,52.644z M40.001,52c0.399,0,0.772,0.152,1.06,0.439
        c0.379,0.38,0.522,0.907,0.392,1.449c-0.124,0.513-0.551,0.94-1.065,1.064c-0.542,0.127-1.069-0.012-1.448-0.393
        c-0.38-0.38-0.522-0.907-0.392-1.448c0.124-0.514,0.552-0.941,1.065-1.064C39.744,52.016,39.874,52,40.001,52z"/>
                                                                    <path d="M43.405,0H27.5v1c0,1.103-0.897,2-2,2s-2-0.897-2-2V0h-3h-2h-5v5h2v50h-2v5h5h2h3v-1c0-1.103,0.897-2,2-2s2,0.897,2,2v1
        h15.905c1.707,0,3.095-1.389,3.095-3.096V3.096C46.5,1.389,45.111,0,43.405,0z M18.5,58h-3v-1h2V3h-2V2h3V58z M44.5,11h-5v2h5v1
        h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v7.904
        c0,0.604-0.491,1.096-1.095,1.096H29.374c-0.445-1.724-2.013-3-3.874-3s-3.428,1.276-3.874,3H20.5V2h1.126
        c0.445,1.724,2.013,3,3.874,3s3.428-1.276,3.874-3h14.031C44.009,2,44.5,2.491,44.5,3.096V11z"/>
                                                                    <path d="M32.5,6h-2v2h-1V6h-2v2h-1V6h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2V8h-2V6z M32.5,14h-8v-4h8V14z" />
                                                                    <path d="M32.5,42h-2v2h-1v-2h-2v2h-1v-2h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2v-8h-2V42z M32.5,50h-8v-4h8V50z" />
                                                                    <path d="M32.5,24h-2v2h-1v-2h-2v2h-1v-2h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2v-8h-2V24z M32.5,32h-8v-4h8V32z" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                </CardContent></Card>
                                        </button>
                                        <Card className="lg:w-4/5  w-full min-w-md:max-w-lg justify-center flex align-middle  lg:flex-row flex-col items-center m-3">
                                            <CardContent className='p-0 w-full h-full'>
                                                <div className=' p-3 font-semibold'>
                                                    {props.motherboardId ? <>
                                                        Carte mére choisi accepte ( {props.ramSlotNumber} {props.ramSlotType} ) barette Ram
                                                    </> : <></>}
                                                </div>
                                                {prod ? <>
                                                    <div className="dark:bg-[#321642d0] bg-[#ffffffe6] flex  justify-between group   md:flex-row flex-col  items-center rounded-xl space-x-3">
                                                        {/* Image & actions */}
                                                        <div className="flex-shrink-0">
                                                            <div className="aspect-square rounded-xl  mt-3  bg-gray-100 ml-3 dark:bg-transparent relative" style={{ height: '150px' }}>
                                                                <Image
                                                                    src={prod.images?.[0]?.url}
                                                                    alt=""
                                                                    fill
                                                                    className="aspect-square object-cover rounded-md h-full w-full"
                                                                />
                                                                <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
                                                                    {/* Add your actions or content here */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Description */}
                                                        <div className="flex-grow  p-3">
                                                            <p className="font-semibold text-sm ">{prod.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {showFullDescription ? prod.description : `${prod.description.slice(0, 100)}...`}
                                                                {prod.description.length > 100 && (
                                                                    <span className=" font-bold  cursor-pointer" onClick={toggleDescription}>
                                                                        {showFullDescription ? ' See Less' : ' See More'}
                                                                    </span>
                                                                )}
                                                            </p>  </div>
                                                        {/* Compatiblité */}
                                                        {props.selectedCompatibility ? <>
                                                            <div className="w-4/5">
                                                                <div className='font-bold my-2 text-sm'>
                                                                    Compatibilité:
                                                                </div>

                                                                <div className="text-left  grid  text-xs max-w-screen-md mx-auto border border-gray-300 rounded mb-3 mr-3">
                                                                    <div className="p-1 pl-3 border-b  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                        <p className={`mb-1 ${props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                            Processeur :
                                                                        </p>
                                                                        <p className={props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                            {props.selectedCompatibility.Compatibility.processorCompatibility.message}
                                                                        </p>
                                                                    </div>

                                                                    <div className="p-1 pl-3 border-b  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                        <p className={`mb-1 ${!ramCompatibility(prod, k).comp ? 'text-red-600' : 'text-green-600'}`}>
                                                                            Ram ({k + 1}) :
                                                                        </p>

                                                                        <p className={!ramCompatibility(prod, k).comp ? 'text-red-600' : 'text-green-600'}>
                                                                            {ramCompatibility(prod, k).message}
                                                                        </p>
                                                                    </div>

                                                                    <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                        <p className={`mb-1 ${props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                            Disque dur compatibilité :
                                                                        </p>
                                                                        <p className={props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                            {props.selectedCompatibility.Compatibility.hardDiskCompatibility.message}
                                                                        </p>
                                                                    </div>

                                                                    <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                        <p className={`mb-1 ${props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                            Boîte d&apos;alimentation compatibilité :
                                                                        </p>
                                                                        <p className={props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                            {props.selectedCompatibility.Compatibility.powerCompatibility.message}
                                                                        </p>
                                                                    </div>

                                                                    <div className="p-1 pl-3  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                                                                        <p className={`mb-1 ${props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                                                                            Boîtier compatibilité :
                                                                        </p>
                                                                        <p className={props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                                                                            {props.selectedCompatibility.Compatibility.caseCompatibility.message}
                                                                        </p>
                                                                    </div>
                                                                </div>




                                                            </div>
                                                        </> : <></>}
                                                        {/* Price & Review */}
                                                        <div className="flex-shrink-0  p-3">
                                                            <div className=' text-center flex flex-col   '>
                                                                <div className='p-3 '>
                                                                    <Currency value={prod.price} />
                                                                </div>
                                                                <Button
                                                                    className='my-2'
                                                                    disabled={loading}
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => updateElementAtIndex(k, null)}
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                                <Button onClick={() => steOpenDialog(!openDialog)}>Changer</Button>
                                                                <a href="zz" className='underline mt-2' target='_blank'>
                                                                    Voir en store
                                                                </a>

                                                            </div>

                                                        </div>
                                                    </div></> : <>

                                                    <div onClick={() => { setopenedramSlot(k); steOpenDialog(!openDialog); }} className='color-[#885bd7]  cursor-pointer  w-full h-full flex justify-center items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} version="1.1" x="0px" y="0px" viewBox="0 0 44 55" ><g><path fill="#885bd7" d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z" /></g></svg>


                                                    </div>

                                                </>}


                                            </CardContent></Card>
                                    </div>
                                </CardContent>
                            </Card>


                        </>
                    ))}</>
            }




            <Dialog open={openDialog} onOpenChange={() => steOpenDialog(!openDialog)}>
                <DialogTrigger asChild >




                </DialogTrigger>
                <DialogContent className='  min-w-full lg:min-w-[80%] min-h-full lg:min-h-[80%]  flex flex-col' >
                    <DialogHeader>
                        <DialogTitle>
                            <div className='flex justify-between pt-3'>
                                <h1>  Barette Ram store</h1>
                                <Menu as="div" className="relative inline-block text-left pr-5">
                                    <div className='flex'>
                                        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-100">
                                            Sort ( <div className='text-sm group inline-flex justify-center  font-medium text-gray-700 hover:text-gray-900 dark:text-gray-100'>{selectedSort} </div>
                                            )
                                            <ChevronDownIcon
                                                className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute  right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-black  shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                {sortOptions.map((option) => (
                                                    <Menu.Item key={option.name}>
                                                        {({ active }) => (
                                                            <a
                                                                onClick={() => {
                                                                    handleSortClick(option.name)
                                                                    setCurrentPage(0)
                                                                }}

                                                                className={classNames(
                                                                    option.current ? 'cursor-pointer text-[#db8d08] font-medium  dark:text-gray-100' : 'cursor-pointer text-gray-500',
                                                                    active ? 'bg-gray-100  ' : '',
                                                                    'block px-4 py-2 text-sm'
                                                                )}
                                                            >
                                                                {option.name}
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className='grid grid-cols-6 gap-3 h-[70vh]' >
                        <div className='col-span-2 overflow-y-auto overflow-x-hidden pr-3'>
                            <SearchComponent
                                priceFilter={priceFilter}
                                setPriceFilter={setPriceFilter}
                                fetchData={fetchData}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}

                                setLoading={setLoading}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                setTotalPages={setTotalPages}
                                totalPages={totalPages} />

                            {props.memoryMarque.list.length > 0 ? <>
                                <br />
                                {
                                    props.motherboardId ? <>
                                        <div >
                                            <div className='flex items-center appearance-none'>
                                                <Input type='checkbox' className='appearance-none forced-colors  focus:outline-none focus-visible:outline-none w-3 h-3 m-2 outline-none'

                                                    checked={compatible}
                                                    onChange={(e) => setcompatible(e.target.checked)}
                                                />
                                                <label className='text-sm'>Compatible avec Carte mére</label>
                                                <div>

                                                </div>

                                            </div>



                                        </div>
                                    </> : <></>
                                }

                                {Object.entries(props).map(([filterKey, filter]) => {
                                    // Check if the current property is one of the specified properties
                                    if (['memoryMarque', 'memoryFrequency', 'memoryType', "memoryNumber"].includes(filterKey)) {
                                        // Type assertion to ensure 'filter' is of the expected type
                                        const filterData = filter as Filter;

                                        return (
                                            <CheckboxGroup
                                                key={filterKey}
                                                label={filterData.title.toString()}
                                                items={filterData.list}
                                                onChange={(value) => handleCheckboxChange(filterKey as keyof checkItemGroupsRam, value)}
                                                selectedItems={filterList[filterKey as keyof checkItemGroupsRam].map((item) => item.searchKey)}
                                            />
                                        );
                                    }

                                    return null; // Skip rendering for other properties
                                })}
                            </> : <></>}


                        </div>
                        <div className='col-span-4 overflow-y-auto overflow-x-hidden ' >
                            {loading === true ? <>
                                <div>
                                    <Container>
                                        <div className="w-full h-full p-8">

                                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />
                                                <Skeleton className="w-full h-48 rounded-xl" />


                                            </div>
                                        </div>
                                    </Container>
                                </div>
                            </> : <>

                                {loading && <p>Loading...</p>}

                                {!loading && data && data.length === 0 && <p>No results found.</p>}

                                {!loading && data.length > 0 && (
                                    <> <div className='text-sm'>({totalPages}) Résultats en {searchTime.toFixed(2)} seconds  </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {data.map((item, key) => (


                                                <div key={key} className={`${checkcompatibility(item) ? 'border-green-600 ' : 'border-red-400'}` + " dark:bg-[#321642d0]   bg-[#ffffffe6] flex flex-col justify-between group cursor-pointer rounded-xl border p-3 space-y-1"}>
                                                    {/* Image & actions */}
                                                    <div>
                                                        <div className="aspect-square rounded-xl bg-gray-100 dark:bg-transparent relative">
                                                            <Image
                                                                src={item.images?.[0]?.url}
                                                                alt=""
                                                                fill
                                                                className="aspect-square object-cover rounded-md"
                                                            />
                                                            <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">

                                                            </div>
                                                        </div>
                                                        {/* Description */}
                                                        <div>
                                                            <p className="font-semibold text-sm ">{item.name}</p>
                                                            <p className="text-sm text-gray-500">{item.category?.name}</p>
                                                        </div>
                                                        {/* Price & Reiew */}
                                                        <div className="flex items-center justify-between text-xs">
                                                            <Currency value={item?.price} />
                                                        </div>
                                                    </div>

                                                    <div className='w-full'>
                                                        <div className='w-full'>
                                                            <Popover >
                                                                <PopoverTrigger className='w-full '>
                                                                    <Button variant={'ghost'} className='my-1 mx-0 w-full border'>Details</Button></PopoverTrigger>
                                                                <PopoverContent>
                                                                    <Label className='font-bold'>Description :</Label>
                                                                    <p className='text-sm'>
                                                                        {item.description}
                                                                    </p>

                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>

                                                        <Button type='submit' disabled={item.stock == 0} onClick={() => {
                                                            updateElementAtIndex(openedramSlot, item)
                                                            steOpenDialog(false)
                                                        }} className={'w-full ' + `${checkcompatibility(item) ? 'bg-green-400 hover:bg-green-600 ' : 'bg-red-400 hover:bg-red-600'}`}>{item.stock == 0 ? 'Hors Stock' : 'Ajouter'}</Button>

                                                    </div>

                                                </div>



                                            ))}
                                        </div>
                                    </>)}

                            </>}
                        </div>


                    </div>

                    <DialogFooter>

                        <div className='grid grid-cols-6 gap-4 w-full' >
                            <div className='w-full flex justify-end col-span-2 '>
                                <Button className='bg-violet-500 my-3 pl-10 pr-7 mx-auto w-full' onClick={() => {

                                    setCurrentPage(0)

                                    fetchData()
                                }} >Filter</Button>
                            </div>
                            {totalPages > 0 ?
                                <div className='col-span-4 flex justify-end'>

                                    {!loading && data.length > 0 && (<>

                                        <Pagination

                                            isCompact showControls
                                            total={parseInt((totalPages / 10).toFixed(0)) + (totalPages % 10 === 0 ? 0 : 1)}
                                            color="secondary"
                                            page={currentPage + 1}
                                            onChange={(e) => {
                                                setCurrentPage(e - 1)
                                            }}
                                        />
                                    </>)} </div> : <></>}

                        </div>

                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}


// You can create a reusable CheckboxGroup component for rendering checkboxes
const CheckboxGroup = (props: {
    label: string;
    items: filterItem[];

    onChange: (value: string) => void;
    selectedItems: string[];
}) => {
    return (
        <div>
            <br />
            <p>{props.label}</p>
            {props.items.map((item) => (
                <div key={item.name}>
                    <div className='flex items-center appearance-none'>
                        <Input type='checkbox' className='appearance-none forced-colors  focus:outline-none focus-visible:outline-none w-3 h-3 m-2 outline-none'
                            value={item.name}
                            checked={props.selectedItems.includes(item.name)}
                            onChange={() => props.onChange(item.name)}
                        />
                        <label className='text-sm'>{item.name} ({item.number})</label>
                        <div>

                        </div>

                    </div>



                </div>
            ))}
        </div>
    );
};