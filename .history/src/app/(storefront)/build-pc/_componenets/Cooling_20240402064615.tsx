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


export type checkItemGroupsCooling = {
  coolingcPUSupport:  checkItem[],
  fansNumber:  checkItem[],
  coolingType:  checkItem[],
  coolingMark:  checkItem[],
}
export const Cooling = (props: {
  selectedCompatibility: AllProductsCompatibility | undefined
  setProcessorId: (values: Product| undefined) => void;
  processorId: Product | undefined,
  profiles: ProfileType[],
  coolingcPUSupport: Filter
  fansNumber: Filter
  coolingType: Filter
  coolingMark: Filter
  motherboardId: Product | undefined,
}) => {
  const [data, setData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000]);

  const [filterList, setFilterList] = useState<checkItemGroupsCooling>({
    coolingcPUSupport: [],
    fansNumber: [],
    coolingType: [],
    coolingMark: [],
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
      const response = await fetch(`/api/Cooling/component?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`);
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
  const handleCheckboxChange = (filterKey: keyof checkItemGroupsCooling, value: string) => {
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

      const PProfiles = props.profiles.filter((e) => e.coolings.find((ee) => ee.productId == Product.id))

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
                  <CardTitle className='text-center'>
                    Refroidisseur CPU
                  </CardTitle>
                </CardHeader>
                <CardContent>



                  <div className='flex align-middle items-center justify-center'>

                    <svg width="100" height='100' id='Layer_1' data-name='Layer 1'
                      viewBox='0 0 45.58 45.58'fill='currentColor' >
                      <defs>
                        <linearGradient id='linear-gradient' x1='2.49' y1='22.79' x2='43.09' y2='22.79' gradientUnits='userSpaceOnUse'>
                          <stop offset='0' stop-color='currentColor' />
                          <stop offset='1' stop-color='currentColor' />
                        </linearGradient>
                        <linearGradient id='linear-gradient-2' x1='8.28' y1='17.65' x2='37.3' y2='17.65'
                        />
                        <linearGradient id='linear-gradient-3' x1='20.08' y1='17.65' x2='25.5' y2='17.65'
                        />
                      </defs>
                      <g>
                        <path
                          d='M13.86,1H38.61a2,2,0,0,0,1.65.51c.69,0,1.39,0,2.09,0,.46,0,.74.26.74.64s-.29.62-.75.64h-.63v.9c.52.13,1.34-.21,1.35.65s-.82.58-1.34.69v.91c.26,0,.49,0,.71,0a.64.64,0,1,1,0,1.27h-.71v.92c.53.1,1.34-.22,1.35.64s-.82.58-1.35.69c0,.15,0,.29,0,.43v.48h.73a.65.65,0,0,1,.67.63.64.64,0,0,1-.66.64h-.71v.94h.72a.64.64,0,1,1,0,1.27h-.73v.69c0,.07,0,.14,0,.25.25,0,.49,0,.73,0a.65.65,0,0,1,.64.66.64.64,0,0,1-.64.61h-.73V17c.25,0,.48,0,.7,0a.65.65,0,0,1,.67.64.64.64,0,0,1-.66.63h-.72v.95c.28,0,.53,0,.78,0a.64.64,0,0,1,.6.65.63.63,0,0,1-.64.61c-.24,0-.47,0-.73,0v.94c.24,0,.45,0,.66,0a.66.66,0,0,1,.71.64.64.64,0,0,1-.7.63h-.68v.95c.28,0,.53,0,.78,0a.65.65,0,0,1,.6.66.63.63,0,0,1-.65.6h-.72v.95c.26,0,.49,0,.71,0a.66.66,0,0,1,.66.65.64.64,0,0,1-.67.62h-.7v.95c.26,0,.5,0,.74,0a.65.65,0,0,1,.63.63.63.63,0,0,1-.66.63c-.23,0-.47,0-.72,0v.91l.4,0c.13,0,.26,0,.38,0a.65.65,0,0,1,.6.66.63.63,0,0,1-.65.6h-.73v.94h.6c.49,0,.79.28.78.66s-.29.61-.77.62H39.86a1.21,1.21,0,0,0-.94.28,1.22,1.22,0,0,1-.75.2c-1.22,0-2.43,0-3.65,0H34v.51c0,1.43,0,2.87,0,4.3a3.86,3.86,0,0,1-3.27,3.78c-.51.08-1,.08-1.59.11v.6a.88.88,0,0,1-1,1H17.44c-.7,0-1-.31-1-1v-.61h-.77a3.91,3.91,0,0,1-4.09-4.09c0-1.36,0-2.73,0-4.09v-.48H11c-1.22,0-2.44,0-3.65,0A3.12,3.12,0,0,1,6.52,34,1.85,1.85,0,0,0,6,33.8c-.92,0-1.84,0-2.76,0-.46,0-.75-.27-.74-.65s.28-.6.72-.62h.68V32c0-.14,0-.28,0-.45H3.2c-.44,0-.71-.26-.71-.63a.65.65,0,0,1,.7-.64c.22,0,.44,0,.67,0v-.94H3.2c-.43,0-.71-.26-.71-.62a.65.65,0,0,1,.69-.65c.23,0,.45,0,.67,0v-.94H3.22c-.44,0-.71-.24-.73-.6s.27-.65.72-.67c.22,0,.44,0,.68,0v-.5c0-.14,0-.28,0-.45H3.2c-.43,0-.71-.25-.71-.62a.66.66,0,0,1,.7-.65h.67v-.9c-.52-.13-1.36.21-1.35-.69s.83-.54,1.35-.65V20.5H3.15a.63.63,0,0,1-.66-.62.64.64,0,0,1,.66-.64c.23,0,.47,0,.72,0v-.94H3.18a.64.64,0,0,1-.69-.65A.65.65,0,0,1,3.17,17c.23,0,.46,0,.72,0v-.49c0-.14,0-.28,0-.45H3.16a.64.64,0,1,1,0-1.27c.24,0,.47,0,.72,0v-.94H3.15a.64.64,0,0,1-.66-.63.66.66,0,0,1,.66-.64h.72v-.94H3.22c-.45,0-.74-.27-.73-.65a.66.66,0,0,1,.72-.62h.65V9.43c-.26,0-.5,0-.74,0a.63.63,0,1,1,0-1.26h.73v-1H3.15a.65.65,0,0,1-.66-.63.64.64,0,0,1,.66-.64c.23,0,.47,0,.72,0V5H3.22a.66.66,0,0,1-.73-.66c0-.37.28-.6.72-.61h.68V2.79H3.24c-.46,0-.75-.27-.75-.64s.28-.63.74-.64c.68,0,1.36,0,2,0A2,2,0,0,0,7,1h4.34c.14.19.35.35.4.56.11.4-.23.71-.72.72H7.45V11L9.66,7.3A2.14,2.14,0,0,1,8.33,4.83a2.09,2.09,0,0,1,1.73-1.66,2.14,2.14,0,0,1,2.37,1.35l3.74-2.23c-.6,0-1.22,0-1.85,0-.36,0-.69,0-.84-.43S13.58,1.23,13.86,1ZM38.15,17.64A15.37,15.37,0,1,0,22.8,33,15.38,15.38,0,0,0,38.15,17.64ZM17.9,37.76c0-.22,0-.54,0-.87,0-.81.37-1.17,1.17-1.17h7.44c.8,0,1.16.36,1.17,1.17v.87c.5.19,1,.23,1.25.51s.22.8.33,1.27h.61c.6,0,.75-.15.75-.76V34.7c0-.13,0-.27,0-.39H15c0,1.6,0,3.19,0,4.77,0,.16.28.39.46.44a3.66,3.66,0,0,0,.87,0c.11-.47.08-1,.33-1.27S17.4,38,17.9,37.76Zm-.18,2.84h6c.17,0,.39,0,.5,0a1.16,1.16,0,0,1,.45.59.53.53,0,0,1-.47.61,2.42,2.42,0,0,1-.47,0H17.73v1.37H27.85V41.9l-.4,0H27c-.43,0-.67-.24-.68-.61s.24-.63.68-.65c.27,0,.54,0,.82,0V39.24H17.72ZM35.92,7.3,38.13,11V2.31H29.45l3.69,2.21a2.14,2.14,0,0,1,2.37-1.35,2.08,2.08,0,0,1,1.74,1.66A2.14,2.14,0,0,1,35.92,7.3ZM38.12,33V24.33L35.93,28c1.15.74,1.53,1.45,1.32,2.49a2.15,2.15,0,0,1-4.11.3L29.47,33ZM7.44,33h8.65l-3.66-2.19a2.16,2.16,0,0,1-2.3,1.36,2.11,2.11,0,0,1-1.77-1.55A2.14,2.14,0,0,1,9.65,28L7.44,24.3ZM31.9,34.31v.47c0,1.41,0,2.81,0,4.21a1.78,1.78,0,0,1-1.82,1.83h-.88v.84c.4,0,.77,0,1.13,0a2.61,2.61,0,0,0,2.41-2.4c0-1.62,0-3.25,0-4.88,0,0,0-.05,0-.07ZM16.39,41.65v-.83H15.6a1.81,1.81,0,0,1-1.92-1.91V34.75c0-.15,0-.3,0-.44h-.83c0,1.58,0,3.14,0,4.69a2.62,2.62,0,0,0,2.3,2.64A10.5,10.5,0,0,0,16.39,41.65ZM35.14,30.88A.86.86,0,1,0,34.3,30,.86.86,0,0,0,35.14,30.88Zm-24.72,0a.86.86,0,0,0,0-1.71.86.86,0,1,0,0,1.71ZM35.15,6.13a.86.86,0,1,0,0-1.71.86.86,0,1,0,0,1.71Zm-24.72,0a.86.86,0,0,0,0-1.71.86.86,0,1,0,0,1.71ZM5.19,3.69h.93V2.82H5.19Zm34.26,0h.94V2.82h-.94ZM6.11,5.92V5H5.2v.89ZM39.46,19.19h.91v-.87h-.91Zm0-3.1V17h.94v-.9ZM5.2,20.51v.9h.91v-.9Zm35.18.91v-.9h-.91v.9ZM5.19,16.09V17h.93v-.89ZM40.4,13.88h-.94v.89h.94ZM5.19,23.62h.92v-.88H5.19Zm35.2,0v-.88h-.93v.88ZM6.11,14.78v-.9H5.19v.9Zm0,11.07V25H5.19v.89Zm33.33,0h.94V25h-.94ZM6.12,27.18H5.19v.87h.93Zm34.26.88v-.89h-.91v.89Zm0-16.38h-.92v.88h.92Zm-35.2,0v.9h.93v-.9Zm.92,18.62v-.89H5.2v.89Zm33.36-.9v.89h.91v-.89Zm0-19h.93V9.45h-.93ZM5.18,32.48h.93V31.6H5.18Zm35.2,0v-.9h-.91v.9ZM6.11,10.35V9.46H5.19v.89Zm0,8.85v-.89H5.2v.89ZM39.46,8.13h.92V7.25h-.92ZM5.2,7.24v.89h.92V7.24ZM39.45,5.9h.94V5h-.94ZM20,37H19.2v.87H20Zm1.33,0v.88h.78V37Zm2.11.85h.8V37h-.8Zm2.93,0V37h-.79v.88Z' />
                        <path
                          d='M23.51,12.76l2.34,1a16.44,16.44,0,0,1,7.93-3.55,18.16,18.16,0,0,0-1.29-1.56C31.76,8,31,7.34,30.2,6.7A.78.78,0,0,1,29.83,6c.07-.51.6-.69,1.08-.36A14,14,0,0,1,34.2,8.68,14.51,14.51,0,1,1,21,3.25a14,14,0,0,1,6.86.8c.52.19.72.58.48,1a.65.65,0,0,1-.85.25c-.86-.29-.86-.28-1.39.47a15,15,0,0,0-2.57,6.9Zm-3.2,17.9a13.39,13.39,0,0,0,8.42-1.18A.4.4,0,0,0,29,29a15,15,0,0,0-3.08-7.17,1.18,1.18,0,0,0-.16-.18c-.71.27-1.33.54-2,.73a.52.52,0,0,0-.45.53,16,16,0,0,1-2.77,7.4C20.47,30.39,20.41,30.5,20.31,30.66Zm-.48-17c.71-.27,1.31-.56,1.94-.73.34-.09.46-.21.5-.54a15.89,15.89,0,0,1,2.65-7.22l.34-.51A1.06,1.06,0,0,0,25,4.6a13.34,13.34,0,0,0-8.15,1.2.45.45,0,0,0-.28.56,15.51,15.51,0,0,0,1.08,3.79A14.36,14.36,0,0,0,19.83,13.68Zm16,6.44c0-.17.07-.3.09-.44a13.45,13.45,0,0,0-1.15-7.78.62.62,0,0,0-.8-.42,15.35,15.35,0,0,0-6,2.35c-.43.29-.83.61-1.16.85.28.75.56,1.39.76,2.06.08.25.14.34.4.37a16.2,16.2,0,0,1,7.52,2.79A3.35,3.35,0,0,0,35.78,20.12ZM15.37,6.76l-.1,0L15,7a13.42,13.42,0,0,0-4.7,6.4.48.48,0,0,0,.2.66,14.73,14.73,0,0,0,5,2.42c.83.22,1.7.35,2.45.51l1-2.39A16.4,16.4,0,0,1,15.37,6.76ZM18.8,20.62c-.28-.77-.52-1.49-.79-2.19a.43.43,0,0,0-.33-.22,16.38,16.38,0,0,1-7.27-2.63l-.63-.41A13.17,13.17,0,0,0,11,23.67a.39.39,0,0,0,.36.16c1.17-.29,2.37-.53,3.51-.93A12.34,12.34,0,0,0,18.8,20.62Zm8.81-2.26c-.14.44-.24.83-.39,1.19s-.39.72-.6,1.11a16.38,16.38,0,0,1,3.59,7.9.42.42,0,0,0,.15-.07,13.25,13.25,0,0,0,5-6.72c.09-.25,0-.36-.19-.48a15.22,15.22,0,0,0-4-2.16A14.36,14.36,0,0,0,27.61,18.36ZM11.9,25.09c0,.06,0,.09,0,.11l.17.25a13.44,13.44,0,0,0,6.42,4.74.51.51,0,0,0,.7-.23,15.26,15.26,0,0,0,2.53-5.47c.16-.67.24-1.35.34-1.92-.73-.34-1.38-.6-2-.93a.42.42,0,0,0-.58.05,15.77,15.77,0,0,1-5.85,3C13.08,24.83,12.49,25,11.9,25.09Zm10.88-3.9a3.54,3.54,0,1,0-3.55-3.54A3.56,3.56,0,0,0,22.78,21.19Z' />
                        <path
                          d='M22.8,20.34a2.69,2.69,0,1,1,2.7-2.7A2.7,2.7,0,0,1,22.8,20.34Zm0-1.27a1.42,1.42,0,1,0-1.43-1.43A1.43,1.43,0,0,0,22.79,19.07Z' />
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
                <h1>  Refroidisseur CPU store</h1>
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


              {props.coolingMark.list.length > 0 ? <>
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
                  if (['coolingcPUSupport', 'fansNumber','coolingType','coolingMark'].includes(filterKey)) {
                    // Type assertion to ensure 'filter' is of the expected type
                    const filterData = filter as Filter;

                    return (
                      <CheckboxGroup
                        key={filterKey}
                        label={filterData.title.toString()}
                        items={filterData.list}
                        onChange={(value) => handleCheckboxChange(filterKey as keyof checkItemGroupsCooling, value)}
                        selectedItems={filterList[filterKey as keyof checkItemGroupsCooling].map((item) => item.searchKey)}
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
                                        
                                                    </div>   </div>



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