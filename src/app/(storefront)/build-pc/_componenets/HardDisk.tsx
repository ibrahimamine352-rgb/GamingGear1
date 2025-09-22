"use client"
import prismadb from '@/lib/prismadb'
import axios from 'axios'
import React, { MouseEventHandler, ReactElement, useEffect, useState, Fragment } from 'react'
import { Button } from "@/components/ui/button"
import { SsdIcon,HddIcon } from "./comps"
import { InlineDetails } from "@/components/InlineDetails";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Container from '@/components/ui/container'
import Skeleton from '@/components/ui/skeleton'
import SearchComponent from '@/components/search-filters/motherboard/motherboard-search'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { Filter, ProfileType, filterItem } from '../page'
import Image from 'next/image'
import { Product } from "@/types";
import usePreviewModal from '@/hooks/use-preview-modal'
import useCart from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import Currency from '@/components/ui/currency'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { Pagination } from '@nextui-org/pagination'
import { AllProductsCompatibility} from './comps'


import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Trash } from 'lucide-react'

type checkItem = { id: number, searchKey: string }
function classNames(...classes: (string | boolean)[]) { return classes.filter(Boolean).join(' '); }

export type checkItemGroupsHardDisk = {
  harddiskType: checkItem[],
  harddiskComputerinterface: checkItem[],
  harddiskCapacity: checkItem[],
  harddiskBrand: checkItem[],
}

export const HardDisk = (props: {
  role: ReactElement<any, any>
  selectedCompatibility: AllProductsCompatibility | undefined
  setProcessorId: (values: Product | undefined) => void;
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
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000]);

  const [filterList, setFilterList] = useState<checkItemGroupsHardDisk>({
    harddiskType: [],
    harddiskComputerinterface: [],
    harddiskCapacity: [],
    harddiskBrand: [],
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

  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const encodedFilterList = encodeURIComponent(JSON.stringify(filterList));
      const startTime = performance.now();

      const response = await fetch(
        `/api/harddisk/component` +
        `?minDt=${priceFilter[0]}` +
        `&maxDt=${priceFilter[1]}` +
        `&q=${searchTerm}` +
        `&sort=${selectedSort}` +
        `&units=10` +
        `&page=${currentPage}` +
        `&filterList=${encodedFilterList}` +
        `${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`
      );

      const dataa = await response.json();
      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000);

      setData(Array.isArray(dataa.data) ? dataa.data : []);
      setTotalPages(dataa.total ?? 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (filterKey: keyof checkItemGroupsHardDisk, value: string) => {
    setFilterList((prev) => {
      const existingIndex = prev[filterKey].findIndex((item) => item.searchKey === value);
      if (existingIndex !== -1) prev[filterKey].splice(existingIndex, 1);
      else prev[filterKey].push({ id: Date.now(), searchKey: value });
      return { ...prev };
    });
  };

  useEffect(() => { fetchData(); }, [currentPage, selectedSort]);
  useEffect(() => { fetchData(); }, []);

  function haveCommonElement<T>(set1: T[], array2: T[]): boolean {
    const array1 = Array.from(set1);
    for (const item of array1) if (array2.includes(item)) return true;
    return false;
  }

  const checkcompatibility = (Product: Product) => {
    const mb = props.motherboardId
    if (mb) {
      const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == mb.id))
      const PProfiles = props.profiles.filter((e) => e.disks.find((ee) => ee.Components.find((Xc) => Xc.productId == Product.id)))
      if (haveCommonElement(MProfiles, PProfiles)) return true
      return false
    }
    return true
  }

  const [openDialog, steOpenDialog] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  // ✅ Narrow selectedCompatibility once and map safely
  const comp = props.selectedCompatibility?.Compatibility;
  const compatRows = [
    { key: 'motherboardCompatibility', label: 'Carte mére :' },
    { key: 'processorCompatibility', label: 'Processeur :' },
    { key: 'gpuCompatibility', label: 'Carte graphique :' },
    { key: 'ramCompatibility', label: 'Ram :' },
    { key: 'hardDiskCompatibility', label: 'Disque dur compatibilité :' },
    { key: 'powerCompatibility', label: 'Boîte d’alimentation compatibilité :' },
    { key: 'caseCompatibility', label: 'Boîtier compatibilité :' },
  ] as const;

  return (
    <div className="text-foreground">
      <Card className="m-3 rounded-2xl build-container">
        <CardContent>
          <div className='flex lg:flex-row flex-col '>
            <button
              onClick={() => steOpenDialog(true)}
              className='lg:w-1/5 w-full min-w-md:max-w-lg m-3 bg-transparent border-transparent hover:bg-[hsl(var(--card)/0.08)] rounded-xl'
            >
              <Card className="build-selector">
                <CardHeader>
                  <CardTitle className='text-center'>
                    <div>Stockage {props.role}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center leading-none text-[hsl(var(--accent))]">
                    {/* simple valid SVG */}
                    <SsdIcon className="block w-16 h-16 md:w-20 md:h-20" />
                    </div>
                </CardContent>
              </Card>
            </button>

            <Card className="lg:w-4/5 w-full justify-center flex md:flex-row flex-col align-middle items-center m-3 build-container">
              <CardContent className='p-0 w-full h-full'>
                {props.processorId ? (
                  <div className="build-container hover:bg-[#1a1a1a] transition flex md:flex-row flex-col justify-between group items-center rounded-xl space-x-3">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="aspect-square mt-3 rounded-xl bg-transparent ml-3 relative" style={{ height: '150px' }}>
                        <Image
                          src={props.processorId.images?.[0]?.url}
                          alt=""
                          fill
                          className="aspect-square object-cover rounded-md h-full w-full"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-grow p-3">
                      <p className="font-semibold text-sm">{props.processorId.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {showFullDescription ? props.processorId.description : `${props.processorId.description.slice(0, 100)}...`}
                        {props.processorId.description.length > 100 && (
                          <span className="font-bold cursor-pointer text-[#007bff]" onClick={toggleDescription}>
                            {showFullDescription ? ' See Less' : ' See More'}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Compatibilité */}
                    {comp ? (
                      <div className="w-4/5">
                        <div className='font-bold my-2 text-sm'>Compatibilité:</div>
                        <div className="text-left grid text-xs max-w-screen-md mx-auto border border-border rounded mb-3 mr-3">
                          {compatRows.map(({ key, label }) => {
                            const item = (comp as any)[key];
                            const isError = !!item?.error;
                            const msg = item?.message ?? '';
                            return (
                              <div key={key} className="p-1 pl-3 border-b last:border-b-0 border-border hover:bg-muted hover:font-bold cursor-pointer">
                                <p className={`mb-1 ${isError ? 'text-red-400' : 'text-[#007bff]'}`}>{label}</p>
                                <p className={isError ? 'text-red-400' : 'text-[#007bff]'}>{msg}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {/* Price & actions */}
                    <div className="flex-shrink-0 p-3">
                      <div className='text-center flex flex-col'>
                        <div className='p-3'><Currency value={props.processorId?.price} /></div>
                        <Button
                          className='mb-3'
                          disabled={loading}
                          variant="destructive"
                          size="sm"
                          onClick={() => props.setProcessorId(undefined)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => steOpenDialog(!openDialog)} className="btn-primary-blue">Changer</Button>
                        <a href="zz" className='underline mt-2 text-[#007bff]' target='_blank'>Voir en store</a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => steOpenDialog(!openDialog)} className='cursor-pointer w-full h-full flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 44 55" className="fill-current text-[hsl(var(--accent))]">
                      <g><path  d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8 c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z"/></g>
                    </svg>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG — compact layout */}
      <Dialog open={openDialog} onOpenChange={() => steOpenDialog(!openDialog)}>
        <DialogTrigger asChild />
        <DialogContent
          className="
            w-[95vw] max-w-[1200px]
            h-[85vh] md:h-[80vh]
            p-0 overflow-hidden
            flex flex-col
            bg-[#101218] text-[#e6e8ee]
            border border-border rounded-2xl
          "
        >
          {/* Sticky header */}
          <DialogHeader className="sticky top-0 z-10 bg-[#101218] border-b border-border px-4 py-3">
            <DialogTitle>
              <div className='flex justify-between items-center'>
                <h1>Stockage store</h1>
                <Menu as="div" className="relative inline-block text-left">
                  <div className='flex'>
                    <Menu.Button className="group inline-flex items-center text-sm font-medium">
                      Sort&nbsp;<span className='text-[#e6e8ee]'>{selectedSort}</span>
                      <ChevronDownIcon className="ml-1 h-5 w-5 text-[#a6adc8]" aria-hidden="true" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-[#12141b] text-[#e6e8ee] border border-border shadow-2xl focus:outline-none">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <Menu.Item key={option.name}>
                            {({ active }) => (
                              <a
                                onClick={() => { setSelectedSort(option.name); setCurrentPage(0); }}
                                className={classNames(
                                  option.current ? 'cursor-pointer text-[#00e0ff] font-medium' : 'cursor-pointer text-[#a6adc8]',
                                  active ? 'bg-[#101218]' : '',
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

          {/* Body: dual scroll panes */}
          <div className='flex-1 grid grid-cols-12 gap-4 px-4 py-4 overflow-hidden text-[13px]'>
            {/* FILTERS */}
            <div className='col-span-12 md:col-span-4 lg:col-span-3 overflow-y-auto pr-1'>
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
                totalPages={totalPages}
              />

              {props.harddiskBrand.list.length > 0 && (
                <>
                  {props.motherboardId ? (
                    <div className="mt-2">
                      <label className='text-sm inline-flex items-center gap-2'>
                        <Input
                          type='checkbox'
                          className='w-3 h-3 m-0'
                          checked={compatible}
                          onChange={(e) => setcompatible(e.target.checked)}
                        />
                        Compatible avec Carte mère
                      </label>
                    </div>
                  ) : null}

                  {Object.entries(props).map(([filterKey, filter]) => {
                    if (['harddiskType', 'harddiskComputerinterface', 'harddiskCapacity', 'harddiskBrand'].includes(filterKey)) {
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
                    return null;
                  })}
                </>
              )}
            </div>

            {/* RESULTS */}
            <div className='col-span-12 md:col-span-8 lg:col-span-9 overflow-y-auto'>
              {loading ? (
                <div>
                  <Container>
                    <div className="w-full h-full p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Skeleton key={i} className="w-full h-48 rounded-xl" />
                        ))}
                      </div>
                    </div>
                  </Container>
                </div>
              ) : (
                <>
                  {data.length === 0 && <p className="text-[#a6adc8]">No results found.</p>}
                  {data.length > 0 && (
                    <>
                      <div className='text-xs text-[#a6adc8] mb-2'>({totalPages}) Résultats en {searchTime.toFixed(2)} seconds</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {data.map((item, key) => (
                          <div key={key} className={`bg-[#12141b] hover:bg-[#101218] transition flex flex-col justify-between group cursor-pointer rounded-xl border border-white/5 p-3 space-y-1 ${checkcompatibility(item) ? 'ring-1 ring-[#00e0ff]/50' : 'ring-1 ring-red-500/40'}`}>
                            <div>
                              <div className="aspect-square rounded-xl bg-transparent relative">
                                <Image
                                  src={item.images?.[0]?.url}
                                  alt=""
                                  fill
                                  className="aspect-square object-cover rounded-md"
                                />
                              </div>
                              <div className="mt-1">
                                <p className="font-semibold text-sm leading-tight">{item.name}</p>
                                <p className="text-xs text-[#a6adc8]">{item.category?.name}</p>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <Currency value={item?.price} />
                              </div>
                            </div>

                            <div className='w-full'>
                            <InlineDetails text={item.description} />

                              <Button
                                type='submit'
                                onClick={() => { props.setProcessorId(item); steOpenDialog(false) }}
                                className='w-full btn-primary-blue'
                              >
                                Ajouter
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sticky footer */}
          <DialogFooter className="sticky bottom-0 bg-[#101218] border-t border-border px-4 py-3">
            <div className='grid grid-cols-12 gap-4 w-full items-center'>
              <div className='col-span-12 md:col-span-4 lg:col-span-3'>
                <Button
                  className='w-full px-6 py-2 bg-[#00a2ff] hover:bg-[#0092e6] text-foreground'
                  onClick={() => { setCurrentPage(0); fetchData(); }}
                >
                  Filter
                </Button>
              </div>

              <div className='col-span-12 md:col-span-8 lg:col-span-9 flex justify-end'>
                {totalPages > 0 && !loading && data.length > 0 && (
                  <Pagination
                    isCompact
                    showControls
                    total={parseInt((totalPages / 10).toFixed(0)) + (totalPages % 10 === 0 ? 0 : 1)}
                    color="default"
                    page={currentPage + 1}
                    onChange={(e) => { setCurrentPage(e - 1) }}
                    classNames={{
                      wrapper: "gap-2",
                      item: "w-8 h-8 text-foreground bg-white/10 border border-border hover:bg-white/20",
                      cursor: "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold shadow-[0_0_20px_hsl(var(--accent)/0.15)]",
                      prev: "bg-white/10 border border-border text-foreground hover:bg-white/20",
                      next: "bg-white/10 border border-border text-foreground hover:bg-white/20"
                    }}
                  />
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Reusable CheckboxGroup
const CheckboxGroup = (props: {
  label: string;
  items: filterItem[];
  onChange: (value: string) => void;
  selectedItems: string[];
}) => {
  return (
    <div className="text-[#e6e8ee]">
      <br />
      <p className="text-sm font-semibold">{props.label}</p>
      {props.items.map((item) => (
        <div key={item.name}>
          <div className='flex items-center'>
            <Input
              type='checkbox'
              className='appearance-none focus:outline-none focus-visible:outline-none w-3 h-3 m-2 outline-none'
              value={item.name}
              checked={props.selectedItems.includes(item.name)}
              onChange={() => props.onChange(item.name)}
            />
            <label className='text-sm text-[#a6adc8]'>
              {item.name} ({item.number})
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};
