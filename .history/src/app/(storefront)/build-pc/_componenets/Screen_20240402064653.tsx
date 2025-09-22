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


export type checkItemGroupsScreen = {
    mark: checkItem[],
    pouce: checkItem[],
    refreshRate: checkItem[],
    resolution: checkItem[],
}
export const Screen = (props: {
  selectedCompatibility: AllProductsCompatibility | undefined
  setProcessorId: (values: Product| undefined) => void;
  processorId: Product | undefined,
  profiles: ProfileType[],
  mark: Filter
  pouce: Filter
  refreshRate: Filter
  resolution: Filter
  motherboardId: Product | undefined,
}) => {
  const [data, setData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState< number[]>([0, 5000]);
 
  const [filterList, setFilterList] = useState<checkItemGroupsScreen>({
    mark: [],
    pouce: [],
    refreshRate: [],
    resolution: [],
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
      const response = await fetch(`/api/Screen/component?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`);
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
  const handleCheckboxChange = (filterKey: keyof checkItemGroupsScreen, value: string) => {
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

        const PProfiles = props.profiles.filter((e) => e.CPUs.find((ee) => ee.productId == Product.id))
              
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
                  <CardTitle className='text-center'>Ecran
                  </CardTitle>
                </CardHeader>
                <CardContent>



                  <div className='flex align-middle items-center justify-center'>

                  <svg id='Layer_1' data-name='Layer 1'
                   width='100'
                   height='100'
fill="currentColor"
    viewBox='0 0 45.58 45.58'>
    <defs>
       
        <linearGradient id='linear-gradient' y1='25.21' x2='45.58' y2='25.21'
            gradientTransform='matrix(1, 0, 0, -1, 0, 48)' gradientUnits='userSpaceOnUse'>
            <stop offset='0' stop-color='currentColor' />
            <stop offset='1' stop-color='currentColor' />
        </linearGradient>
        <linearGradient id='linear-gradient-2' x1='3.52' y1='30.28' x2='42.04' y2='30.28'
           />
        <linearGradient id='linear-gradient-3' x1='21.87' y1='40.99' x2='23.7' y2='40.99'
            />
    </defs>
    <g>
        <path 
            d='M0,4.84A1.13,1.13,0,0,1,1.29,4.3c2.78.42,5.57.78,8.37,1.06,3,.31,5.93.55,8.91.62a2.14,2.14,0,0,1,.43.07.93.93,0,0,1,.78,1,.9.9,0,0,1-1,.85c-1,0-2.11,0-3.15-.11-1.39-.09-2.77-.21-4.16-.32C9.68,7.3,7.87,7.1,6.07,6.87l-4-.52c-.24,0-.3.05-.29.25v22c0,.57,0,.57.58.5,2.07-.27,4.14-.57,6.21-.79,1.81-.2,3.63-.36,5.45-.49,3.38-.24,6.77-.35,10.17-.31,2.68,0,5.36.13,8,.35,3.33.27,6.66.62,10,1.11l1.19.16c.22,0,.34,0,.34-.26v-22c0-.56,0-.57-.55-.5-2,.25-4,.53-6.08.77-1.77.2-3.56.37-5.35.48s-3.34.24-5,.26a.93.93,0,0,1-1-1.26.87.87,0,0,1,.6-.56A3.94,3.94,0,0,1,27.1,6C30,5.91,33,5.67,35.87,5.37s5.65-.65,8.46-1.07a1.09,1.09,0,0,1,1.25.54V34.15a1.31,1.31,0,0,1-1.46.46c-1.63-.34-3.25-.64-4.88-1a2.34,2.34,0,0,1-1-.42c-1.21-.89-2.46-1.75-3.65-2.68a3.53,3.53,0,0,0-2.13-.81c-1.8-.08-3.6-.24-5.41-.29-.42,0-.55.13-.53.53,0,.72,0,1.45,0,2.18a.82.82,0,0,0,.31.68L34,39.38a3.12,3.12,0,0,1,.44.45.9.9,0,0,1-.68,1.44c-1.2,0-2.4,0-3.61,0a1.47,1.47,0,0,1-.66-.24c-2.08-1-4.17-2.07-6.24-3.13a.82.82,0,0,0-.83,0c-2.09,1-4.19,2.09-6.28,3.15a2,2,0,0,1-1,.23h-3a1,1,0,0,1-.71-1.74c2.09-1.91,4.16-3.84,6.26-5.74,1.33-1.2,1.36-1.18,1.34-3,0-.44.2-1-.11-1.28s-.85-.1-1.29-.08c-1.81.1-3.63.23-5.45.35a.93.93,0,0,0-.51.24c-1.25.91-2.52,1.79-3.73,2.74a5,5,0,0,1-2.41,1c-1.35.21-2.68.48-4,.77A1.33,1.33,0,0,1,0,34.15Zm14.48,34.5a1.55,1.55,0,0,0,1.14-.14c2.11-1.06,4.22-2.09,6.31-3.17a1.69,1.69,0,0,1,1.71,0c2.11,1.09,4.24,2.13,6.36,3.19a1.43,1.43,0,0,0,1.06.13,1.15,1.15,0,0,0-.15-.2l-5.49-5a.78.78,0,0,0-.57-.18H20.72a.89.89,0,0,0-.64.25c-1,.94-2,1.86-3,2.8ZM22.76,32c.49,0,1,0,1.47,0,.26,0,.41-.08.41-.37,0-.61,0-1.21,0-1.82,0-.23-.07-.37-.32-.39a19.41,19.41,0,0,0-3.05,0c-.24,0-.33.15-.33.38,0,.61,0,1.21,0,1.82,0,.29.13.39.4.38C21.81,32,22.29,32,22.76,32ZM8.05,30.37s0-.06,0-.09H7.85c-1.67.21-3.35.42-5,.65-1.07.16-1.06.19-1,1.28,0,.31.09.39.39.33L4.85,32a3.75,3.75,0,0,0,1.33-.31C6.82,31.3,7.43,30.82,8.05,30.37Zm29.49-.11v.1l1.64,1.21a1.67,1.67,0,0,0,.64.28c1,.18,2,.39,3,.58s.9.17.9-.75c0-.62,0-.62-.64-.69l-3-.41C39.27,30.46,38.41,30.37,37.54,30.26Z' />
        <path 
            d='M42,17.73v8.21c0,.87-.31,1.2-1.19,1.13-1.13-.09-2.26-.26-3.4-.37l-4.23-.42c-2.66-.27-5.32-.35-8-.42-2.06-.06-4.12,0-6.19,0-3,.08-6,.29-8.95.58-1.7.16-3.38.39-5.08.58a3.14,3.14,0,0,1-.75,0,.85.85,0,0,1-.73-.92c0-1.2,0-2.4,0-3.6v-13c0-.91.36-1.26,1.26-1.16,1.68.18,3.35.4,5,.58,1,.12,2.09.21,3.14.29q6.24.48,12.48.35c2.18,0,4.35-.15,6.53-.31s4.54-.4,6.81-.66c.6-.06,1.2-.16,1.8-.23a1.51,1.51,0,0,1,1,.07.93.93,0,0,1,.51.95Zm-36.67,0c0,2.29,0,4.59,0,6.88,0,.42.16.51.53.45,2.45-.35,4.91-.56,7.38-.77,2.63-.21,5.26-.27,7.9-.34,2.18-.06,4.36,0,6.54.09.72,0,1.45,0,2.18.09,1.72.13,3.45.26,5.17.42,1.51.13,3,.31,4.51.48.61.07.64.08.64-.52V11a2.25,2.25,0,0,1,0-.26c0-.23-.09-.33-.33-.3l-2.37.29c-1.81.21-3.62.37-5.44.5-1.14.08-2.27.14-3.41.19-2.89.15-5.78.2-8.67.12s-5.68-.22-8.51-.48c-1.86-.18-3.71-.38-5.57-.59-.51-.06-.53-.07-.53.45Q5.37,14.31,5.37,17.72Z' />
        <path  d='M23.7,7a.92.92,0,1,1-.93-.93A.92.92,0,0,1,23.7,7Z' />
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
                <h1>  Ecran store</h1>
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
 

              {props.mark.list.length > 0 ? <>
                <br />
                {
                  props.motherboardId?<>
                        <div >
         



        </div>   
                  </>:<></>
                }
          
                {Object.entries(props).map(([filterKey, filter]) => {
                  // Check if the current property is one of the specified properties
                  if (['mark', 'pouce','refreshRate', 'resolution'].includes(filterKey)) {
                    // Type assertion to ensure 'filter' is of the expected type
                    const filterData = filter as Filter;

                    return (
                      <CheckboxGroup
                        key={filterKey}
                        label={filterData.title.toString()}
                        items={filterData.list}
                        onChange={(value) => handleCheckboxChange(filterKey as keyof checkItemGroupsScreen, value)}
                        selectedItems={filterList[filterKey as keyof checkItemGroupsScreen].map((item) => item.searchKey)}
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
                                        
                                                    </div></div>



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