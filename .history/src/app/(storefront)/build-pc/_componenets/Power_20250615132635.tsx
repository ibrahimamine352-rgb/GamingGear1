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
import { SelectedFeatures } from './BuildForm'

type checkItem = {
  id: number,
  searchKey: string
}

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}


export type checkItemGroupsPower = {
    psCertification: checkItem[],
    powersupplyMarque: checkItem[],
}
export const Power = (props: {
      removeFeature:(featureName:string) => void;
          addFeature:(featureName:string, value:any)=> void;
          selectedFeatures:SelectedFeatures,
  selectedCompatibility: AllProductsCompatibility | undefined
  setProcessorId: (values: Product| undefined) => void;
  processorId: Product | undefined,
  profiles: ProfileType[],
  psCertification: Filter
  powersupplyMarque: Filter
  motherboardId: Product | undefined,
}) => {
  const [data, setData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState< number[]>([0, 5000]);
 
  const [filterList, setFilterList] = useState<checkItemGroupsPower>({
    psCertification: [],
    powersupplyMarque: [],
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
      const response = await fetch(`/api/powersupply/component?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`);
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
  const handleCheckboxChange = (filterKey: keyof checkItemGroupsPower, value: string) => {
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

        const PProfiles = props.profiles.filter((e) => e.powersupplys.find((ee) => ee.productId == Product.id))
              
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
                  <CardTitle className='text-center'>Bloc d&apos;alimentation
                  <p className='text-xs text-[#885bd7] p-1'>(*Obligatoire)</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>



                  <div className='flex align-middle items-center justify-center'>

                  <svg id='Layer_1' width="100" height='100' fill='currentColor' data-name='Layer 1'  viewBox='0 0 45.58 45.58'><defs><linearGradient id='linear-gradient' x1='1.45' y1='22.79' x2='44.12' y2='22.79' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='#ff3c00'/><stop offset='1' stop-color='#ff8000'/></linearGradient><linearGradient id='linear-gradient-2' x1='4.6' y1='29.11' x2='26.75' y2='29.11' /><linearGradient id='linear-gradient-3' x1='29.9' y1='22' x2='40.97' y2='22' /><linearGradient id='linear-gradient-4' x1='30.69' y1='36.62' x2='40.18' y2='36.62' /><linearGradient id='linear-gradient-5' x1='32.27' y1='29.11' x2='33.86' y2='29.11' /><linearGradient id='linear-gradient-6' x1='34.64' y1='29.11' x2='36.23' y2='29.11' /><linearGradient id='linear-gradient-7' x1='37.01' y1='29.11' x2='38.6' y2='29.11' /><linearGradient id='linear-gradient-8' x1='40.18' y1='17.26' x2='41.75' y2='17.26' /><linearGradient id='linear-gradient-9' x1='3.83' y1='17.26' x2='5.4' y2='17.26' /><linearGradient id='linear-gradient-10' x1='3.83' y1='40.97' x2='5.4' y2='40.97' /><linearGradient id='linear-gradient-11' x1='40.18' y1='40.97' x2='41.75' y2='40.97' /><linearGradient id='linear-gradient-12' x1='14.89' y1='10.15' x2='30.69' y2='10.15' /><linearGradient id='linear-gradient-13' x1='16.47' y1='7.78' x2='29.11' y2='7.78' /><linearGradient id='linear-gradient-14' x1='18.05' y1='5.41' x2='27.53' y2='5.41' /><linearGradient id='linear-gradient-15' x1='9.36' y1='4.62' x2='10.93' y2='4.62' /><linearGradient id='linear-gradient-16' x1='34.64' y1='4.62' x2='36.22' y2='4.62' /><linearGradient id='linear-gradient-17' x1='5.41' y1='12.52' x2='6.98' y2='12.52' /><linearGradient id='linear-gradient-18' x1='38.6' y1='12.52' x2='40.17' y2='12.52' /><linearGradient id='linear-gradient-19' x1='33.05' y1='36.62' x2='34.64' y2='36.62' /><linearGradient id='linear-gradient-20' x1='36.22' y1='36.62' x2='37.8' y2='36.62' /></defs><g><path  className='cls-1' d='M22.73,44.13H2.64c-1,0-1.19-.21-1.19-1.19q0-13.82,0-27.65a2.75,2.75,0,0,1,.27-1.12c2-4,4-8,6-12a1.19,1.19,0,0,1,1.23-.76q13.88,0,27.75,0a1.2,1.2,0,0,1,1.22.76c2,4,4,8,6,12a2.47,2.47,0,0,1,.24,1q0,13.88,0,27.75c0,.9-.23,1.13-1.14,1.13ZM42.52,15.72H3.07v26.8H42.52Zm-39-1.65H42l-.13-.3C40.16,10.3,38.42,6.84,36.7,3.36A.58.58,0,0,0,36.07,3Q22.8,3,9.51,3a.63.63,0,0,0-.67.42Q6.31,8.55,3.75,13.64Z'/><path  className='cls-2' d='M7.31,21.79a9.57,9.57,0,0,1-.75-.69A.78.78,0,1,1,7.66,20c.25.24.47.51.7.75,4.87-3.59,9.69-3.61,14.66,0,.18-.21.38-.48.62-.72A.78.78,0,0,1,24.82,20a.78.78,0,0,1-.08,1.18c-.23.23-.5.42-.71.6,3.63,4.95,3.62,9.77,0,14.7.23.2.51.4.75.65a.77.77,0,0,1,0,1.14.78.78,0,0,1-1.15,0c-.24-.24-.45-.52-.66-.75-4.91,3.63-9.74,3.61-14.69,0-.16.19-.34.45-.56.67-.42.42-.86.46-1.21.12s-.33-.8.12-1.25c.2-.21.44-.39.64-.57C3.7,31.55,3.69,26.73,7.31,21.79ZM9.25,34.37c-2.47-3.51-2.47-7-.05-10.45L8.45,23a9.28,9.28,0,0,0,0,12.12Zm13.66.82a9.28,9.28,0,0,0,0-12.13l-.78.79a8.46,8.46,0,0,1,0,10.53ZM9.59,36.35a9.31,9.31,0,0,0,12.21-.1l-.61-.5L21,35.53a8.41,8.41,0,0,1-10.54,0ZM21.76,21.88a9.3,9.3,0,0,0-12.13,0l.78.8a8.43,8.43,0,0,1,10.53,0ZM18.88,33.53a5.49,5.49,0,0,1-3.21,1,5.57,5.57,0,0,1-3.19-1l-.89.81c2.19,1.9,6.21,1.89,8.11,0Zm-8.46-8.47c-2.12,2.51-1.65,6.43,0,8.05l.86-.76a5.47,5.47,0,0,1-1.07-3.24,5.65,5.65,0,0,1,1.06-3.24ZM20.89,33.2A6.4,6.4,0,0,0,20.82,25l-.58.66-.16.2a5.54,5.54,0,0,1,0,6.52Zm-8.48-8.49a5.62,5.62,0,0,1,6.5,0l.83-.8a6.4,6.4,0,0,0-8.1,0Zm.1,2.27a3.58,3.58,0,0,0,0,4.24A4.5,4.5,0,0,1,13,30.7a.63.63,0,0,0,.2-.79,2.37,2.37,0,0,1-.06-1.34,1,1,0,0,0-.42-1.31A1.48,1.48,0,0,1,12.51,27Zm6.34,4.28a3.59,3.59,0,0,0,0-4.24,3.72,3.72,0,0,1-.46.51c-.29.23-.28.45-.19.8a2.45,2.45,0,0,1,.05,1.34,1,1,0,0,0,.39,1.27A1.91,1.91,0,0,1,18.85,31.26Zm-1,1a3.83,3.83,0,0,1-.55-.47.65.65,0,0,0-.8-.21,2.33,2.33,0,0,1-1.33.06,1,1,0,0,0-1.32.42c-.06.09-.14.16-.21.25A3.67,3.67,0,0,0,17.82,32.29Zm-4.28-6.35a3.32,3.32,0,0,1,.55.48.57.57,0,0,0,.79.18,2.26,2.26,0,0,1,1.73,0c.11,0,.29.09.35,0,.29-.24.54-.52.82-.8A3.75,3.75,0,0,0,13.54,25.94ZM15.67,28a1.08,1.08,0,1,0,1.08,1.06A1.1,1.1,0,0,0,15.67,28Z'/><path  className='cls-3' d='M35.43,19.63H40c.7,0,1,.28,1,1q0,1.41,0,2.82c0,.64-.29.93-.94.93H30.84c-.65,0-.93-.29-.94-.94V20.57c0-.65.29-.93.94-.94Zm.82,1.6v1.53h3.1V21.23Zm-4.74,0v1.54H34.6V21.22Z'/><path  className='cls-4' d='M35.42,40.18H31.67c-.7,0-1-.28-1-1,0-1.23,0-2.47,0-3.7a2.36,2.36,0,0,1,2.41-2.41h4.69a2.35,2.35,0,0,1,2.38,2.38c0,1.27,0,2.53,0,3.8,0,.64-.29.92-1,.93Zm3.17-1.6c0-1.09,0-2.14,0-3.19a.73.73,0,0,0-.77-.74H33.07a.7.7,0,0,0-.77.67c0,1.08,0,2.16,0,3.26Z'/><path  className='cls-5' d='M32.27,29.12c0-.51,0-1,0-1.53a.79.79,0,0,1,.78-.84.78.78,0,0,1,.8.83q0,1.53,0,3.06a.79.79,0,0,1-.78.84.78.78,0,0,1-.79-.83C32.26,30.14,32.27,29.63,32.27,29.12Z'/><path  className='cls-6' d='M36.22,29.12c0,.51,0,1,0,1.53a.79.79,0,0,1-.79.83.77.77,0,0,1-.78-.84q0-1.53,0-3.06a.77.77,0,0,1,.78-.83.79.79,0,0,1,.79.84C36.23,28.1,36.22,28.61,36.22,29.12Z'/><path  className='cls-7' d='M37,29.11c0-.51,0-1,0-1.53a.79.79,0,1,1,1.57,0q0,1.53,0,3.06a.79.79,0,1,1-1.57,0C37,30.13,37,29.62,37,29.11Z'/><path  className='cls-8' d='M40.18,17.25a.77.77,0,0,1,.79-.77.78.78,0,0,1,.78.79.81.81,0,0,1-.8.78A.79.79,0,0,1,40.18,17.25Z'/><path  className='cls-9' d='M4.61,16.48a.78.78,0,0,1,.79.78.8.8,0,0,1-.78.79.79.79,0,0,1,0-1.57Z'/><path  className='cls-10' d='M4.61,41.75A.79.79,0,0,1,3.83,41,.79.79,0,1,1,5.4,41,.78.78,0,0,1,4.61,41.75Z'/><path  className='cls-11' d='M41.75,41a.8.8,0,0,1-.77.8.78.78,0,0,1-.8-.76.79.79,0,0,1,.76-.81A.8.8,0,0,1,41.75,41Z'/><path  className='cls-12' d='M22.81,9.36h6.77a2.13,2.13,0,0,1,.44,0,.75.75,0,0,1,.66.74.76.76,0,0,1-.66.8,2.13,2.13,0,0,1-.44,0H15.65a.79.79,0,0,1-.76-.81.77.77,0,0,1,.76-.76c.31,0,.63,0,.94,0Z'/><path  className='cls-13' d='M22.79,8.57H17.41c-.55,0-.88-.26-.93-.69s.3-.88.88-.89H28.12c.59,0,.92.24,1,.69s-.32.89-.93.89Z'/><path  className='cls-14' d='M22.79,6.2H19c-.63,0-1-.3-1-.79s.36-.79,1-.79h7.51c.62,0,1,.3,1,.79s-.37.79-1,.79Z'/><path  className='cls-15' d='M10.13,3.83a.79.79,0,1,1-.77.81A.8.8,0,0,1,10.13,3.83Z'/><path  className='cls-16' d='M36.22,4.66a.79.79,0,1,1-.75-.83A.8.8,0,0,1,36.22,4.66Z'/><path  className='cls-17' d='M7,12.52a.79.79,0,1,1-.79-.79A.8.8,0,0,1,7,12.52Z'/><path  className='cls-18' d='M40.17,12.53a.81.81,0,0,1-.8.78.79.79,0,1,1,.8-.78Z'/><path  className='cls-19' d='M34.64,36.65a3.2,3.2,0,0,1,0,.44.77.77,0,0,1-.8.71.76.76,0,0,1-.76-.71,6.94,6.94,0,0,1,0-.79.79.79,0,1,1,1.58,0c0,.12,0,.23,0,.35Z'/><path  className='cls-20' d='M37.8,36.62v.15c0,.67-.28,1-.79,1s-.78-.36-.79-1v-.49a.79.79,0,1,1,1.58,0C37.81,36.39,37.8,36.51,37.8,36.62Z'/></g></svg>

                  </div>
                </CardContent></Card>
            </button>
            <Card className="lg:w-4/5 w-full min-w-md:max-w-lg justify-center flex  md:flex-row flex-col align-middle items-center m-3">
              <CardContent className='p-0 w-full h-full'>

                {props.processorId ? <>
                  <div className="dark:bg-[#391846a6] bg-[#ffffffe6] border-[#ca9bf5] flex md:flex-row flex-col justify-between group items-center rounded-xl space-x-3">
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
 

              {props.psCertification.list.length > 0 ? <>
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
                  if (['psCertification', 'powersupplyMarque'].includes(filterKey)) {
                    // Type assertion to ensure 'filter' is of the expected type
                    const filterData = filter as Filter;

                    return (
                      <CheckboxGroup
                        key={filterKey}
                        label={filterData.title.toString()}
                        items={filterData.list}
                        onChange={(value) => handleCheckboxChange(filterKey as keyof checkItemGroupsPower, value)}
                        selectedItems={filterList[filterKey as keyof checkItemGroupsPower].map((item) => item.searchKey)}
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
                                        
                                                    </div>           </div>



                      ))}
                    </div>
                  </>)}

              </>}
            </div>


          </div>

          <DialogFooter>

            <div className='grid grid-cols-6 gap-4 w-full' >
              <div className='w-full flex justify-end col-span-2 '>
                <Button className=' my-3 pl-10 pr-7 mx-auto w-full' onClick={() => {

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