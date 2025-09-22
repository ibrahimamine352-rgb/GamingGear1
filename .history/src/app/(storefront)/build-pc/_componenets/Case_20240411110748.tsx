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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type checkItem = {
    id: number,
    searchKey: string
}

function classNames(...classes: (string | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}


export type checkItemGroupsCase = {
    pCcaseRGBType: checkItem[],
    pCcaseNumberofFansPreinstalled: checkItem[],
    pCcaseCaseformat: checkItem[],
    pCcaseBrand: checkItem[],
}
export const Case = (props: {
    selectedCompatibility: AllProductsCompatibility | undefined
    setProcessorId: (values: Product | undefined) => void;
    processorId: Product | undefined,
    profiles: ProfileType[],
    pCcaseRGBType: Filter
    pCcaseNumberofFansPreinstalled: Filter
    pCcaseCaseformat: Filter
    pCcaseBrand: Filter
    motherboardId: Product | undefined,
}) => {
    const [data, setData] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000]);

    const [filterList, setFilterList] = useState<checkItemGroupsCase>({
        pCcaseRGBType: [],
        pCcaseNumberofFansPreinstalled: [],
        pCcaseCaseformat:[],
        pCcaseBrand:[]
    })


    const [selectedSort, setSelectedSort] = useState('Prix : Croissant');
    const [searchTerm, setSearchTerm] = useState('');
    const [compatible, setcompatible] = useState(false);
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
            const response = await fetch(`/api/pcCase/component?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`);
            const dataa = await response.json();
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
    const handleCheckboxChange = (filterKey: keyof checkItemGroupsCase, value: string) => {
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
    const previewModal = usePreviewModal();
    const cart = useCart();
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

            const PProfiles = props.profiles.filter((e) => e.cases.find((ee) => ee.productId == Product.id))

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
    return (
        <div>
            <Card className="m-3" >
                <CardContent>
                    <div className='flex lg:flex-row flex-col '>
                        <button onClick={() => steOpenDialog(true)} className='lg:w-1/5 w-full min-w-md:max-w-lg  m-3 bg-transparent border-transparent hover:bg-transparent hover:border-transparent '>
                            <Card className="   ">
                                <CardHeader>
                                    <CardTitle className='text-center'>Boitier
                                        <p className='text-xs text-[#885bd7] p-1'>(*Obligatoire)</p>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>



                                    <div className='flex align-middle items-center justify-center'>


                                        <svg id='Boitier' width='100' height='100' viewBox='0 0 34.062 39.245'><defs><linearGradient id='linear-gradient' x1='0.5' x2='0.5' y2='1' gradientUnits='objectBoundingBox'><stop offset='0' stop-color='currentColor' /><stop offset='1' stop-color='currentColor' /></linearGradient></defs><path id='Tracé_151' data-name='Tracé 151' d='M18.028,0c.153.062.3.131.461.183Q25.86,2.642,33.231,5.1c.758.253.83.352.83,1.151q0,13.365,0,26.729c0,.772-.08.888-.808,1.131q-7.516,2.507-15.032,5.013a2.331,2.331,0,0,1-.75.122q-8.272,0-16.543,0c-.707,0-.924-.211-.924-.905Q0,19.611,0,.886A.929.929,0,0,1,.412,0Zm.337,19.607q0,8.731,0,17.462c0,.528,0,.529.487.367Q25.516,35.216,32.182,33a.6.6,0,0,0,.484-.681q-.015-12.714,0-25.428a.6.6,0,0,0-.483-.683q-6.67-2.2-13.329-4.433c-.488-.162-.488-.161-.488.366q0,8.731,0,17.462m-1.359,0q0-8.883,0-17.766c0-.51,0-.511-.5-.511H1.957c-.549,0-.55,0-.55.547q0,17.728,0,35.456c0,.549,0,.55.548.55H16.467c.538,0,.539,0,.539-.547q0-8.864,0-17.728' transform='translate(0)' fill='currentColor' /><path id='Tracé_152' data-name='Tracé 152' d='M32.07,37.936q2.814,0,5.628,0c.692,0,.923.229.925.913,0,.753.005,1.506,0,2.259a.743.743,0,0,1-.784.838c-.1.008-.2.005-.306.005q-5.475,0-10.951,0a2.629,2.629,0,0,1-.457-.026.689.689,0,0,1-.639-.735c-.013-.842-.015-1.685,0-2.527.009-.484.3-.726.841-.727q2.872-.006,5.743,0m.007,1.4c-1.569,0-3.138.008-4.706-.006-.355,0-.536.094-.486.473a1.863,1.863,0,0,1,0,.229c0,.505,0,.507.512.507H36.5c.729,0,.713,0,.727-.725.007-.367-.119-.488-.486-.485-1.556.015-3.112.006-4.668.006' transform='translate(-22.868 -34.054)' fill='currentColor' /><path id='Tracé_153' data-name='Tracé 153' d='M37.564,103.024c-1.811,0-3.622-.009-5.433.007-.373,0-.488-.128-.481-.488.021-1.08-.085-.926.913-.928q5.2-.008,10.407,0c.569,0,.571,0,.57.577,0,.946.073.83-.849.832-1.709,0-3.418,0-5.127,0' transform='translate(-28.411 -91.212)' fill='currentColor' /><path id='Tracé_154' data-name='Tracé 154' d='M37.6,128.543H32.248c-.536,0-.543,0-.543-.525,0-1-.059-.883.884-.883q5.221,0,10.442,0c.554,0,.559,0,.557.552,0,.985.08.853-.86.856-1.708.006-3.417,0-5.125,0' transform='translate(-28.46 -114.122)' fill='currentColor' /><path id='Tracé_155' data-name='Tracé 155' d='M70.4,218.843a1.986,1.986,0,1,1,3.972.012,1.986,1.986,0,1,1-3.972-.012m1.977.607a.634.634,0,0,0,.609-.576.585.585,0,0,0-.6-.6.555.555,0,0,0-.574.58.582.582,0,0,0,.567.6' transform='translate(-63.195 -194.667)' fill='currentColor' /><path id='Tracé_156' data-name='Tracé 156' d='M74.373,269.824a1.986,1.986,0,1,1-2-1.993,1.995,1.995,0,0,1,2,1.993m-1.385.005a.6.6,0,0,0-.586-.582.59.59,0,1,0,.015,1.18.6.6,0,0,0,.57-.6' transform='translate(-63.197 -240.425)' fill='currentColor' /><path id='Tracé_157' data-name='Tracé 157' d='M134.052,326.721c0-.344,0-.688,0-1.032,0-.223.091-.325.319-.323,1.3.015,1.068-.165,1.089,1.008.008.446-.006.892,0,1.338,0,.258-.1.37-.362.368-1.262-.01-1.024.12-1.049-.977,0-.127,0-.255,0-.382Z' transform='translate(-120.331 -292.072)' fill='currentColor' /><path id='Tracé_158' data-name='Tracé 158' d='M32.891,326.383c0,.318,0,.636,0,.954,0,.076.021.172-.017.225-.271.382-.673.125-1.011.186-.191.034-.365-.034-.366-.276a12.791,12.791,0,0,1,.028-2.169c.091-.541.66-.166,1-.252.209-.053.371.035.364.3-.009.343,0,.687,0,1.03Z' transform='translate(-28.242 -291.748)' fill='currentColor' /><path id='Tracé_159' data-name='Tracé 159' d='M83.077,326.721c0-.343.005-.686,0-1.029,0-.22.078-.329.31-.326,1.274.018,1.07-.178,1.089,1,.007.445,0,.89,0,1.334,0,.246-.092.377-.359.375-1.28-.008-1.01.115-1.039-.977,0-.127,0-.254,0-.381Z' transform='translate(-74.571 -292.071)' fill='currentColor' /><path id='Tracé_160' data-name='Tracé 160' d='M109.955,326.684c0,.331-.006.661,0,.992.006.266-.1.4-.38.4-1.247-.009-1,.107-1.025-.956-.01-.458.008-.916,0-1.373-.007-.271.084-.393.371-.387,1.2.024,1.019-.161,1.037.985,0,.115,0,.229,0,.343Z' transform='translate(-97.439 -292.063)' fill='currentColor' /><path id='Tracé_161' data-name='Tracé 161' d='M58.7,326.464c0,.331,0,.663,0,.994,0,.4-.306.343-.516.3-.288-.055-.78.267-.828-.29a11.623,11.623,0,0,1,0-2.1c.058-.6.583-.221.889-.3.219-.056.472-.041.457.321s0,.714,0,1.071' transform='translate(-51.443 -291.767)' fill='currentColor' /></svg>

                                    </div>
                                </CardContent></Card>
                        </button>
                        <Card className="lg:w-4/5 w-full min-w-md:max-w-lg justify-center flex  md:flex-row flex-col align-middle items-center m-3">
                            <CardContent className='p-0 w-full h-full'>

                                {props.processorId ? <>
                                    <div className="dark:bg-[#321642d0] bg-[#ffffffe6] flex md:flex-row flex-col justify-between group items-center rounded-xl space-x-3">
                                        {/* Image & actions */}
                                        <div className="flex-shrink-0">
                                            <div className="aspect-square mt-3 rounded-xl bg-gray-100 ml-3 dark:bg-transparent relative" style={{ height: '150px' }}>
                                                <Image
                                                    src={props.processorId.images?.[0]?.url}
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
                                            <p className="font-semibold text-sm ">{props.processorId.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {showFullDescription ? props.processorId.description : `${props.processorId.description.slice(0, 100)}...`}
                                                {props.processorId.description.length > 100 && (
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
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.motherboardCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                              Carte mére :
                            </p>
                            <p className={props.selectedCompatibility.Compatibility.motherboardCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                              {props.selectedCompatibility.Compatibility.motherboardCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 border-b  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                              Processeur :
                            </p>
                            <p className={props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                              {props.selectedCompatibility.Compatibility.processorCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 border-b  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.gpuCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                              Carte graphique :
                            </p>
                            <p className={props.selectedCompatibility.Compatibility.gpuCompatibility.error ? 'text-red-600' : 'text-green-600'}>
                              {props.selectedCompatibility.Compatibility.gpuCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 border-b  border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40  hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.ramCompatibility.error ? 'text-red-600' : 'text-green-600'}`}>
                              Ram :
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
                                                    <Currency value={props.processorId?.price} />
                                                </div>
                                                <Button   
                                                className='mb-3'
                                                            disabled={loading}
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => props.setProcessorId(undefined)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                <Button onClick={() => steOpenDialog(!openDialog)}>Changer</Button>
                                                <a href="zz" className='underline mt-2' target='_blank'>
                                                    Voir en store
                                                </a>

                                            </div>

                                        </div>
                                    </div>

                                </> : <>
                                    <div onClick={() => steOpenDialog(!openDialog)} className='color-[#885bd7]  cursor-pointer  w-full h-full flex justify-center items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} version="1.1" x="0px" y="0px" viewBox="0 0 44 55" ><g><path fill="#885bd7" d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z" /></g></svg>


                                    </div>
                                </>}


                            </CardContent></Card>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={openDialog} onOpenChange={() => steOpenDialog(!openDialog)}>
                <DialogTrigger asChild >



                </DialogTrigger>
                <DialogContent className='  min-w-full lg:min-w-[80%] min-h-full lg:min-h-[80%]  flex flex-col' >
                    <DialogHeader>
                        <DialogTitle>
                            <div className='flex justify-between pt-3'>
                                <h1>  Processeur store</h1>
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


                            {props.pCcaseCaseformat.list.length > 0 ? <>
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
                                    if (['pCcaseRGBType', 'pCcaseNumberofFansPreinstalled','pCcaseCaseformat','pCcaseBrand'].includes(filterKey)) {
                                        // Type assertion to ensure 'filter' is of the expected type
                                        const filterData = filter as Filter;

                                        return (
                                            <CheckboxGroup
                                                key={filterKey}
                                                label={filterData.title.toString()}
                                                items={filterData.list}
                                                onChange={(value) => handleCheckboxChange(filterKey as keyof checkItemGroupsCase, value)}
                                                selectedItems={filterList[filterKey as keyof checkItemGroupsCase].map((item) => item.searchKey)}
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
                                                  
                                                    <Button type='submit' onClick={() => { props.setProcessorId(item); steOpenDialog(false) }} className={'w-full ' + `${checkcompatibility(item) ? 'bg-green-400 hover:bg-green-600 ' : 'bg-red-400 hover:bg-red-600'}`}>Ajouter</Button>
                                        
                                                    </div>       </div>



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
                                           total={parseInt((totalPages / 10).toFixed(0)) + (totalPages % 10 === 0 ? 0 : 1)-1}
                     
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