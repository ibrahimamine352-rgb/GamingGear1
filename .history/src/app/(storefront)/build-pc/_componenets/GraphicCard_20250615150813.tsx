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
import {  SelectedFeatures } from './BuildForm'
import { getRecommendations } from './getRecommendations'
 function extractGpuSize(title: string | undefined): number | null {
  // Guard clause for undefined or non-string input
  if (!title || typeof title !== 'string') {
    return null;
  }

  // Regex to match number followed by g, gb, or go (case-insensitive)
  const regex = /(\d+)\s*(g|gb|go)\b/i;
  const match = title.match(regex);

  if (match) {
    // Extract the numeric part (group 1) and convert to number
    return parseInt(match[1], 10);
  }

  return null;
}
type checkItem = {
    id: number,
    searchKey: string
}

function classNames(...classes: (string | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}


export type checkItemGroupsGPU = {
    gpuBrand: checkItem[],
    graphiccardName: checkItem[],
    gpuArchBrand: checkItem[],
}
export const GraphicCard = (props: {
    selectedCompatibility: AllProductsCompatibility | undefined
    setProcessorId: (values: Product| undefined) => void;
    removeFeature:(featureName:string) => void;
    addFeature:(featureName:string, value:any)=> void;
    selectedFeatures:SelectedFeatures,
    processorId: Product | undefined,
    profiles: ProfileType[],
    graphiccardName: Filter
    gpuArchBrand: Filter
    gpuBrand: Filter
    motherboardId: Product | undefined,
}) => {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [priceFilter, setPriceFilter] = useState<number[]>([0, 10000]);
    const [recommendedGpuMemorie,setRecommendedGpuMemorie]= useState();
    const [filterList, setFilterList] = useState<checkItemGroupsGPU>({
        gpuBrand: [],
        gpuArchBrand: [],
        graphiccardName: []
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
            const response = await fetch(`/api/gpu/component?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`);
            const dataa = await response.json();
            const endTime = performance.now();

            // Calculate the time taken
            const timeTaken = ((endTime - startTime) / 1000);
            setSearchTime(timeTaken)

            setData(dataa.data);
            setTotalPages(dataa.total);
            setLoading(false);
            console.log(dataa);

           const res= await getRecommendations(props.selectedFeatures);
           setRecommendedGpuMemorie(res.recommendations[0].videoCardMemory) 
           console.log(recommendedGpuMemorie)
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    };
    // Function to handle checkbox change
    const handleCheckboxChange = (filterKey: keyof checkItemGroupsGPU, value: string) => {
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
                                    <CardTitle className='text-center'>Carte graphique
                                        
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>



                                    <div className='flex align-middle items-center justify-center'>

                                        <svg width='100' height='100'
                                            viewBox='0 0 46.8 32.897'
                                            fill="currentColor"
                                        >
                                            <defs>
                                                <linearGradient id='linear-gradient' x1='0.5' x2='0.5' y2='1' gradientUnits='objectBoundingBox'>
                                                    <stop offset='0' stop-color='currentColor' />
                                                    <stop offset='1' stop-color='currentColor' />
                                                </linearGradient>
                                            </defs>
                                            <g id='GPU' transform='translate(-332.999 -430)'>
                                                <path id='Tracé_109' data-name='Tracé 109'
                                                    d='M46.8,23.574a5.091,5.091,0,0,1-1.861,2.9,4.835,4.835,0,0,1-2.808.948c-.593.018-1.188.022-1.781,0-.386-.015-.5.141-.5.509.015,1.233.008,2.466,0,3.7,0,.967-.293,1.259-1.255,1.262q-2.694.006-5.388,0c-1.017,0-1.291-.277-1.3-1.313-.006-1.2-.015-2.405.005-3.607.007-.415-.129-.57-.552-.552-.669.029-1.339.021-2.009,0-.343-.009-.448.126-.445.457.013,1.263.006,2.527,0,3.79,0,.938-.275,1.217-1.229,1.22q-3.311.011-6.621.007-4.772,0-9.544-.006a4.781,4.781,0,0,1-.547-.016.832.832,0,0,1-.845-.931c-.008-1.339-.013-2.679,0-4.018,0-.37-.1-.515-.49-.506-.943.021-1.888.019-2.831,0-.36-.007-.478.124-.474.479.012,1.218,0,2.435-.007,3.653A3.275,3.275,0,0,1,6.3,32.1a.815.815,0,0,1-.877.748.8.8,0,0,1-.762-.864c-.014-.807-.031-1.615,0-2.42.021-.469-.135-.62-.6-.588-.515.036-1.035.017-1.552,0a.872.872,0,0,1-.97-1q-.006-2.945,0-5.891c0-.737.279-1,1.032-1.01.563,0,1.127-.009,1.689,0,.266,0,.389-.085.385-.368-.016-1.249.132-1.054-1.016-1.074-.426-.007-.854.009-1.276-.035a.818.818,0,1,1,.088-1.632c.609-.009,1.218-.011,1.826,0,.273,0,.383-.1.378-.374-.023-1.364.162-1.089-1.046-1.117-.38-.009-.761,0-1.142,0a.811.811,0,0,1-.917-.933q-.008-2.991,0-5.982a.861.861,0,0,1,.95-.972c.562-.022,1.127-.023,1.689,0,.361.013.479-.126.469-.48-.028-1.1.123-.94-.942-.954-.365,0-.731,0-1.1,0-.695-.007-1.074-.31-1.068-.849s.4-.826,1.091-.831c.518,0,1.035-.013,1.552,0,.321.01.469-.083.463-.437q-.025-1.461,0-2.922c.007-.346-.126-.446-.456-.441-1.065.015-2.131.008-3.2,0C.359,1.676.016,1.4,0,.884S.342.02,1,.013Q3.171-.01,5.34.012c.678.008.992.356,1,1.039.006.791.015,1.583-.006,2.374-.01.383.136.531.508.492a4.446,4.446,0,0,1,.456,0h34.02c3.094,0,4.459.96,5.484,3.856ZM24.594,5.6q-8.836,0-17.671-.007c-.42,0-.584.1-.583.555q.023,9.5.014,19c0,.6,0,.6.606.6q3.653,0,7.306-.006,13.744,0,27.489.005a4.984,4.984,0,0,0,.864-.041,3.117,3.117,0,0,0,2.589-3.362q.01-6.667,0-13.333A4.009,4.009,0,0,0,45,7.614,3.022,3.022,0,0,0,42.083,5.6q-8.744-.007-17.489,0M19.521,27.437H15.96c-1.248,0-2.5.011-3.744-.006-.361,0-.477.118-.47.475q.029,1.438,0,2.876c-.006.345.122.457.454.442.456-.02.913-.019,1.369,0,.321.013.431-.119.426-.429a7.837,7.837,0,0,1,.043-1.228.808.808,0,0,1,.836-.693.848.848,0,0,1,.783.763,5.882,5.882,0,0,1,.015.593c.026,1.122-.21.976,1.037.994.3,0,.4-.13.4-.412a8.788,8.788,0,0,1,.032-1.185.839.839,0,0,1,.885-.75.854.854,0,0,1,.753.841c.012.182,0,.365.006.548.02,1.081-.177.936.98.96.332.007.471-.108.462-.447a5.135,5.135,0,0,1,.054-1.229.83.83,0,0,1,.852-.674.841.841,0,0,1,.754.785c.013.166.006.335.006.5,0,1.152,0,1.144,1.152,1.061.26-.019.346-.124.34-.368-.009-.35-.006-.7,0-1.05a.858.858,0,0,1,.794-.934c.481-.011.813.366.824.946.007.35.009.7,0,1.05-.006.252.1.357.354.352.472-.009.944-.02,1.415,0,.361.018.482-.12.475-.475-.017-.913-.03-1.827,0-2.739.018-.479-.159-.586-.607-.582-2.374.019-4.749.009-7.123.009m16.384,0c-.609,0-1.218.017-1.825-.006-.369-.014-.516.1-.5.488.026.745-.005,1.491.01,2.236.025,1.231-.27,1.046,1.142,1.064.257,0,.352-.108.347-.357-.008-.411-.015-.822.008-1.232a.827.827,0,0,1,.777-.758.818.818,0,0,1,.824.755c.017.181.007.365.011.547.027,1.2-.215,1.02,1.073,1.049.324.007.422-.12.418-.43-.013-.974-.016-1.948,0-2.921.006-.348-.13-.449-.458-.44-.608.018-1.217.005-1.826.005M4.654,12.565c0-.472,0-.943,0-1.415-.012-.992.145-.864-.91-.894-.4-.011-.538.121-.53.522.021,1.034,0,2.069.008,3.1.009,1.1-.167.966,1.062.98.276,0,.378-.107.373-.379-.011-.639,0-1.278,0-1.917m0,12.47c0-.472,0-.944,0-1.416-.009-.91.136-.841-.852-.872-.477-.015-.6.168-.589.614.026.989,0,1.979.009,2.968.006,1.077-.127.952.983.977.376.008.468-.148.456-.49-.02-.593-.006-1.187-.006-1.781'
                                                    transform='translate(333 430)' fill='currentColor' />
                                                <path id='Tracé_110' data-name='Tracé 110'
                                                    d='M217.068,66.214a8.618,8.618,0,1,1,8.612,8.637,8.65,8.65,0,0,1-8.612-8.637m6.357-6.56c.1.179.26.2.387.273a5.384,5.384,0,0,1,2.324,2.361,5.567,5.567,0,0,1,.248.635.667.667,0,0,0,.655.407c.266.026.238-.271.273-.444a4.262,4.262,0,0,0-.786-3.4.389.389,0,0,0-.287-.2,6.693,6.693,0,0,0-2.814.369m-4.014,3.579a5.606,5.606,0,0,1,4.555.21c.219.12.479-.086.653-.233.155-.132-.021-.31-.1-.442a4.324,4.324,0,0,0-3.029-1.911.372.372,0,0,0-.337.089,6.911,6.911,0,0,0-1.737,2.287m8.555,9.54c-.392-.238-.686-.4-.96-.586a4.889,4.889,0,0,1-2-2.584.673.673,0,0,0-.7-.472c-.259,0-.23.318-.27.51a4.324,4.324,0,0,0,.39,2.66,1.245,1.245,0,0,0,1.43.9,7.683,7.683,0,0,0,2.11-.43m1.115-10.642a4.885,4.885,0,0,1-.545,2.21.661.661,0,0,0,.156.792c.18.215.393-.025.55-.133a4.313,4.313,0,0,0,1.8-2.9.558.558,0,0,0-.152-.5,7.154,7.154,0,0,0-1.844-1.469c-.078-.043-.169-.12-.25-.062-.11.079-.031.194,0,.292a7.707,7.707,0,0,1,.291,1.771m2.879,7.091a5.537,5.537,0,0,1-4.523-.2c-.254-.139-.509.082-.691.237-.147.124.034.311.118.44a4.229,4.229,0,0,0,3.029,1.889.389.389,0,0,0,.338-.09,6.9,6.9,0,0,0,1.73-2.277m-11.641,1.2a.554.554,0,0,0,.209.49,7.02,7.02,0,0,0,1.7,1.358c.109.062.228.213.36.1.108-.091,0-.228-.033-.339a5.714,5.714,0,0,1-.191-2.519,4.49,4.49,0,0,1,.475-1.416c.169-.3-.027-.529-.147-.761-.086-.167-.244-.07-.359,0a4.258,4.258,0,0,0-2.015,3.089m-1.209-1.947c.075-.063.106-.078.119-.1a5.345,5.345,0,0,1,3.2-2.861c.3-.09.323-.4.345-.639s-.25-.241-.412-.274a4.266,4.266,0,0,0-3.363.751.469.469,0,0,0-.238.367,6.436,6.436,0,0,0,.35,2.758M232.262,64c-.071.04-.089.045-.1.056a5.509,5.509,0,0,1-3.242,2.9c-.292.087-.322.407-.329.648-.006.222.263.235.428.261a4.418,4.418,0,0,0,3.3-.721.512.512,0,0,0,.281-.391A6.416,6.416,0,0,0,232.262,64m-6.618,3.712a1.484,1.484,0,1,0-1.477-1.49,1.522,1.522,0,0,0,1.477,1.49'
                                                    transform='translate(142.422 379.441)' fill='currentColor' />
                                                <path id='Tracé_111' data-name='Tracé 111'
                                                    d='M80.908,66.318a8.615,8.615,0,1,1-17.229-.127,8.615,8.615,0,1,1,17.229.127m-10.8-6.636c.026.151.12.179.2.22a6.106,6.106,0,0,1,1.3.908,4.531,4.531,0,0,1,1.371,2.111.651.651,0,0,0,.671.445c.287.022.259-.3.292-.485a4.245,4.245,0,0,0-.323-2.535c-.457-1.02-.521-1.072-1.634-1.033a5.1,5.1,0,0,0-1.879.369m-4.085,3.586a5.607,5.607,0,0,1,4.524.2c.256.141.509-.081.695-.232.155-.126-.027-.312-.111-.44A4.285,4.285,0,0,0,68.142,60.9a.435.435,0,0,0-.381.1,6.7,6.7,0,0,0-1.734,2.266m3.3,9.282a5.44,5.44,0,0,1,.17-4.507c.148-.276-.067-.513-.213-.7s-.34.017-.478.107a4.337,4.337,0,0,0-1.871,2.957.562.562,0,0,0,.175.5,6.823,6.823,0,0,0,2.216,1.645m9.243-3.286a5.51,5.51,0,0,1-4.485-.192c-.273-.15-.512.059-.692.219s.01.344.1.485a4.3,4.3,0,0,0,3.014,1.857.336.336,0,0,0,.3-.066,6.716,6.716,0,0,0,1.761-2.3m-3.945,3.559c-.168-.1-.232-.137-.3-.173s-.163-.082-.241-.129a5.1,5.1,0,0,1-2.457-2.874.686.686,0,0,0-.7-.477c-.268-.011-.235.307-.273.5a4.225,4.225,0,0,0,.79,3.313.448.448,0,0,0,.324.232,6.9,6.9,0,0,0,2.854-.391M75.3,60.007a7.515,7.515,0,0,1,.383,2.321,5.3,5.3,0,0,1-.583,2.182c-.128.257.067.518.242.687.155.15.342-.042.482-.136a4.283,4.283,0,0,0,1.814-2.839.521.521,0,0,0-.043-.443,6.221,6.221,0,0,0-2.3-1.772m3.582,4.009c-.085.067-.118.081-.131.1a5.335,5.335,0,0,1-3.2,2.865c-.305.092-.323.41-.346.64-.026.254.276.253.449.28a4.44,4.44,0,0,0,3.3-.724.655.655,0,0,0,.3-.533,6.746,6.746,0,0,0-.367-2.633M65.754,68.6c.184-.325.314-.583.47-.825a4.907,4.907,0,0,1,2.716-2.182.692.692,0,0,0,.472-.7c.021-.258-.316-.232-.5-.268a4.275,4.275,0,0,0-3.209.71.583.583,0,0,0-.328.463,6.753,6.753,0,0,0,.385,2.8M72.3,64.786a1.483,1.483,0,0,0,0,2.966,1.483,1.483,0,1,0,0-2.966'
                                                    transform='translate(277.092 379.403)' fill='currentColor' />
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
                                                            onClick={() =>{ props.setProcessorId(undefined); props.removeFeature("Video Card_Memory") }}
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
                                <h1>  Carte graphique store</h1>
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


                            {props.gpuBrand.list.length > 0 ? <>
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
                                    if (['gpuBrand', 'gpuArchBrand', 'graphiccardName'].includes(filterKey)) {
                                        // Type assertion to ensure 'filter' is of the expected type
                                        const filterData = filter as Filter;

                                        return (
                                            <CheckboxGroup
                                                key={filterKey}
                                                label={filterData.title.toString()}
                                                items={filterData.list}
                                                onChange={(value) => handleCheckboxChange(filterKey as keyof checkItemGroupsGPU, value)}
                                                selectedItems={filterList[filterKey as keyof checkItemGroupsGPU].map((item) => item.searchKey)}
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
<div>
              {extractGpuSize(item.title) === recommendedGpuMemorie && recommendedGpuMemorie !== null && (
                <span className="text-green-500 font-semibold">Recommandé par AI</span>
              )}
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
                                                  
                                                    <Button type='submit' onClick={() => { props.setProcessorId(item); steOpenDialog(false);}} className={'w-full ' + `${checkcompatibility(item) ? 'bg-green-400 hover:bg-green-600 ' : 'bg-red-400 hover:bg-red-600'}`}>Ajouter</Button>
                                        
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