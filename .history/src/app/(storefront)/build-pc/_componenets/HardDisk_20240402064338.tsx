"use client"
import prismadb from '@/lib/prismadb'
import axios from 'axios'
import React, { MouseEventHandler, ReactElement, useEffect, useState } from 'react'
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


export type checkItemGroupsHardDisk = {
    harddiskType: checkItem[],
    harddiskComputerinterface: checkItem[],
    harddiskCapacity: checkItem[],
    harddiskBrand: checkItem[],
}
export const HardDisk = (props: {
    role:ReactElement<any, any>
  selectedCompatibility: AllProductsCompatibility | undefined
  setProcessorId: (values: Product| undefined) => void;
  processorId: Product | undefined,
  profiles: ProfileType[],
  harddiskType: Filter
    harddiskComputerinterface: Filter
    harddiskCapacity: Filter
    harddiskBrand: Filter
  motherboardId: Product | undefined,
}) => {


  const [data, setData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState< number[]>([0, 5000]);
 
  const [filterList, setFilterList] = useState<checkItemGroupsHardDisk>({
    harddiskType: [],
    harddiskComputerinterface: [],
    harddiskCapacity: [],
    harddiskBrand: [],
  })


  const [selectedSort, setSelectedSort] = useState('Les plus populaires');
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
      const response = await fetch(`/api/harddisk/component?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`);
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
      setData([]);
      setTotalPages(0);
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };
  // Function to handle checkbox change
  const handleCheckboxChange = (filterKey: keyof checkItemGroupsHardDisk, value: string) => {
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
    const mb=props.motherboardId
    if(mb){
        const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == mb.id))

        const PProfiles = props.profiles.filter((e) => e.disks.find((ee) => ee.Components.find((Xc)=>Xc.productId== Product.id) ))
              
        if(haveCommonElement(MProfiles,PProfiles)){
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
                  <CardTitle className='text-center'  >
                     <div>
                    Stockage {props.role}
                        </div>
                    
                    </CardTitle>
                </CardHeader>
                <CardContent>



                  <div className='flex align-middle items-center justify-center'>

                  <svg fill="currentColor"  width="100" height="100" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
	 viewBox="0 0 512 512" >
<g>
	<g>
		<g>
			<path d="M257.515,246.188c-29.326,0-53.184,23.858-53.184,53.184c0,29.326,23.858,53.185,53.184,53.185
				c29.326,0,53.184-23.859,53.184-53.185C310.7,270.046,286.842,246.188,257.515,246.188z M257.515,336.389
				c-20.411,0-37.016-16.605-37.016-37.017c0-20.411,16.605-37.016,37.016-37.016c20.411,0,37.016,16.605,37.016,37.016
				C294.531,319.784,277.927,336.389,257.515,336.389z"/>
			<path d="M342.409,356.9c-3.521-2.745-8.601-2.116-11.346,1.406c-0.652,0.836-1.318,1.663-1.998,2.478
				c-2.86,3.429-2.401,8.526,1.028,11.386c1.511,1.261,3.348,1.877,5.175,1.877c2.314,0,4.612-0.988,6.212-2.905
				c0.793-0.952,1.573-1.917,2.335-2.895C346.56,364.725,345.931,359.645,342.409,356.9z"/>
			<path d="M315.075,204.485c-3.777-2.381-8.769-1.251-11.15,2.527c-2.382,3.777-1.25,8.769,2.527,11.15
				c28.078,17.706,44.841,48.064,44.841,81.212c0,14.272-3.056,28.002-9.082,40.804c-1.901,4.04-0.167,8.856,3.872,10.757
				c1.112,0.523,2.284,0.772,3.437,0.772c3.033,0,5.942-1.717,7.32-4.644c7.047-14.974,10.622-31.019,10.622-47.69
				C367.461,260.64,347.878,225.168,315.075,204.485z"/>
			<path d="M317.017,81.756c-43.201,0-78.713,33.449-82.059,75.806c-69.109,10.208-122.318,69.909-122.318,141.81
				c0,79.05,64.31,143.36,143.36,143.36s143.36-64.31,143.36-143.36c0-28.775-8.529-55.594-23.182-78.072
				c14.797-15.302,23.182-35.765,23.182-57.203C399.36,118.695,362.421,81.756,317.017,81.756z M383.192,299.371
				c0,70.135-57.058,127.193-127.192,127.193s-127.192-57.058-127.192-127.192c0-66.136,50.742-120.636,115.339-126.633
				c0.888-0.082,1.776-0.158,2.665-0.222c0.232-0.017,0.465-0.029,0.697-0.044c0.89-0.059,1.782-0.111,2.672-0.152
				c0.266-0.012,0.534-0.021,0.801-0.03c0.853-0.033,1.704-0.06,2.556-0.077c0.3-0.005,0.6-0.008,0.901-0.012
				c0.829-0.01,1.658-0.014,2.487-0.008c0.299,0.002,0.597,0.008,0.896,0.011c0.847,0.012,1.694,0.031,2.541,0.06
				c0.26,0.009,0.521,0.019,0.78,0.029c0.891,0.036,1.783,0.08,2.674,0.135c0.218,0.013,0.434,0.027,0.652,0.041
				c0.929,0.061,1.857,0.134,2.785,0.214c0.191,0.017,0.383,0.033,0.573,0.051c0.924,0.085,1.847,0.182,2.771,0.288
				C333.881,180.289,383.192,234.176,383.192,299.371z M280.493,158.115c2.869-17.575,18.152-31.034,36.526-31.034
				c20.411,0,37.016,16.605,37.016,37.016c0,8.639-3.015,16.897-8.415,23.469C327.107,172.699,304.844,162.324,280.493,158.115z
				 M366.481,208.026c-2.779-3.356-5.712-6.588-8.782-9.68c8.026-9.521,12.504-21.603,12.504-34.247
				c0-29.326-23.858-53.184-53.184-53.184c-26.664,0-48.808,19.724-52.609,45.348c-0.101-0.006-0.202-0.009-0.303-0.014
				c-0.673-0.038-1.347-0.068-2.022-0.096c-0.538-0.023-1.076-0.044-1.613-0.061c-0.548-0.017-1.097-0.03-1.646-0.041
				c-0.668-0.013-1.338-0.022-2.007-0.026c-0.274-0.001-0.545-0.011-0.819-0.011c-0.209,0-0.417,0.008-0.626,0.008
				c-0.682,0.003-1.366,0.013-2.048,0.026c-0.517,0.01-1.036,0.018-1.552,0.033c-0.15,0.004-0.297,0.004-0.447,0.01
				c3.966-32.725,31.913-58.166,65.691-58.166c36.489,0,66.174,29.685,66.174,66.174
				C383.192,180.38,377.186,195.979,366.481,208.026z"/>
			<path d="M437.163,63.596c4.466,0,8.084-3.619,8.084-8.084V26.214C445.247,11.76,433.487,0,419.033,0H92.967
				C78.513,0,66.753,11.76,66.753,26.214v17.44v148.75v262.934c0,14.456,11.76,26.216,26.214,26.216h1.887v22.362
				c0,4.466,3.619,8.084,8.084,8.084h54.973c4.466,0,8.084-3.618,8.084-8.084v-22.362h180.008v22.362
				c0,4.466,3.618,8.084,8.084,8.084h54.973c4.466,0,8.084-3.618,8.084-8.084v-22.362h1.887c14.455,0,26.214-11.76,26.214-26.216
				V79.225c0-4.466-3.618-8.084-8.084-8.084c-4.466,0-8.084,3.619-8.084,8.084v376.113c0,5.54-4.507,10.047-10.046,10.047h-9.972
				h-54.973H157.912h-54.973h-9.972c-5.54,0-10.046-4.508-10.046-10.047v-254.85h27.052c4.466,0,8.084-3.618,8.084-8.084V43.655
				c0-4.466-3.618-8.084-8.084-8.084H82.921v-9.356c0-5.54,4.507-10.046,10.046-10.046h326.065c5.54,0,10.046,4.507,10.046,10.046
				v29.297C429.079,59.977,432.698,63.596,437.163,63.596z M362.173,481.554h38.804v14.278h-38.804V481.554z M111.023,481.554
				h38.804v14.278h-38.804V481.554z M101.888,51.739V184.32H82.921V51.739H101.888z"/>
		</g>
	</g>
</g>
</svg>
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
                <h1>  Stockage store</h1>
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
 

              {props.harddiskBrand.list.length > 0 ? <>
                <br />
                {
                  props.motherboardId?<>
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
                  </>:<></>
                }
          
                {Object.entries(props).map(([filterKey, filter]) => {
                  // Check if the current property is one of the specified properties
                  if (['harddiskType', 'harddiskComputerinterface',"harddiskCapacity","harddiskBrand"].includes(filterKey)) {
                    // Type assertion to ensure 'filter' is of the expected type
                    const filterData = filter as Filter;
 
                    return (
                      <CheckboxGroup
                        key={filterKey}
                        label={filterData.title.toString()}
                        items={filterData.list}
                        onChange={(value) => handleCheckboxChange(filterKey as keyof checkItemGroupsHardDisk, value)}
                        selectedItems={filterList[filterKey as keyof checkItemGroupsHardDisk].map((item) => item.searchKey)}
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