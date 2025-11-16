"use client"

import React, { MouseEventHandler, useEffect, useState, Fragment } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InlineDetails } from "@/components/InlineDetails";
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";

import Container from '@/components/ui/container'
import Skeleton from '@/components/ui/skeleton'
import SearchComponent from '@/components/search-filters/motherboard/motherboard-search' // keep your path
import { CpuIcon } from "./comps"
import { Filter, ProfileType, filterItem } from '../page'
import Image from 'next/image'
import { Product } from "@/types";
import { Trash } from 'lucide-react'
import usePreviewModal from '@/hooks/use-preview-modal'
import useCart from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import Currency from '@/components/ui/currency'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { Pagination } from '@nextui-org/pagination'
import type { AllProductsCompatibility } from "./comps";
import { extractCoreCount, SelectedFeatures } from './BuildForm'
import { getRecommendations } from './getRecommendations'

type checkItem = { id: number, searchKey: string }
import { XMarkIcon } from '@heroicons/react/24/outline'

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type checkItemGroupsCPU = {
  cPUSupport: checkItem[],
  processorModel: checkItem[],
}
// CPU socket filtering depending on processor model
const AMD_SOCKETS = ["AM5", "AM4", "sTR5"];
const INTEL_SOCKETS = [
  "Intel LGA 1200",
  "Intel LGA 1700",
  "Intel LGA 1851",
  "Intel LGA 1151",
];

const getFilteredCpuSupportItems = (
  allItems: filterItem[],
  selectedProcessorModels: checkItem[]
): filterItem[] => {
  if (!selectedProcessorModels || selectedProcessorModels.length === 0) {
    // no brand selected → show all
    return allItems;
  }

  const selected = selectedProcessorModels.map((p) =>
    p.searchKey.toLowerCase()
  );

  const amdSelected = selected.some((s) => s.includes("amd"));
  const intelSelected = selected.some((s) => s.includes("intel"));

  // only AMD
  if (amdSelected && !intelSelected) {
    return allItems.filter((item) => AMD_SOCKETS.includes(item.name));
  }

  // only INTEL
  if (intelSelected && !amdSelected) {
    return allItems.filter((item) => INTEL_SOCKETS.includes(item.name));
  }

  // both / unknown → keep all
  return allItems;
};



export const Processor = (props: {
  removeFeature:(featureName:string) => void;
  addFeature:(featureName:string, value:any)=> void;
  selectedFeatures:SelectedFeatures,
  selectedCompatibility: AllProductsCompatibility | undefined
  setProcessorId: (values: Product| undefined) => void;
  processorId: Product | undefined,
  profiles: ProfileType[],
  processorModel: Filter
  cPUSupport: Filter
  motherboardId: Product | undefined,
}) => {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];
  const [data, setData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000]);

  const [filterList, setFilterList] = useState<checkItemGroupsCPU>({
    cPUSupport: [],
    processorModel: [],

  })
  

  const [selectedSort, setSelectedSort] = useState('Prix : Croissant');
  const [searchTerm, setSearchTerm] = useState('');
  const [compatible, setcompatible] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  const [recommendedcpuclock,setRecommendedcpuclock]= useState<any>();
  const [recommendedcpuclockgh,setRecommendedcpuclockgh]= useState<any>();

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

      const response = await fetch(
        `/api/processor/component?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`
      );
      const dataa = await response.json();
      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000)

      // Show products first so UI always renders even if AI fails
      setData(dataa.data);
      setTotalPages(dataa.total);
      setLoading(false);

      // Try AI recommendations without blocking render
      try {
        const res = await getRecommendations(props.selectedFeatures);
        setRecommendedcpuclockgh(res.recommendations?.[0]?.cpuClock);
        setRecommendedcpuclock(res.recommendations?.[0]?.cpuCoreCount);
      } catch (e) {
        console.error('getRecommendations failed', e);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  const handleCheckboxChange = (filterKey: keyof checkItemGroupsCPU, value: string) => {
    setFilterList((prev) => {
      const existingIndex = prev[filterKey].findIndex((item) => item.searchKey === value);
      if (existingIndex !== -1) prev[filterKey].splice(existingIndex, 1);
      else prev[filterKey].push({ id: Date.now(), searchKey: value });
      return { ...prev };
    });
  };

  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();
  const handleClick = (id: any) => router.push(`/product/${id}`);

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => { event.stopPropagation(); };
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => { event.stopPropagation(); };

  const handleSortClick = (name: React.SetStateAction<string>) => setSelectedSort(name);

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
      const PProfiles = props.profiles.filter((e) => e.CPUs.find((ee) => ee.productId == Product.id))
      if (haveCommonElement(MProfiles, PProfiles)) return true
      return false
    }
    return true
  }

  const [openDialog, steOpenDialog] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  return (
    <div className="text-foreground">
      <Card className="m-3 rounded-2xl build-container">
        <CardContent>
          <div className='flex lg:flex-row flex-col '>
            {/* LEFT SELECTOR */}
            <button onClick={() => steOpenDialog(true)} className='lg:w-1/5 w-full min-w-md:max-w-lg m-3 bg-transparent border-transparent hover:bg-[hsl(var(--card)/0.08)] rounded-xl'>
              <Card className="build-selector">
                <CardHeader>
                  <CardTitle className='text-center'>
                  {ui.navCpu}
                    <p className='text-xs text-[hsl(var(--accent))] p-1'>{ui.builderRequiredTag}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-center leading-none text-[hsl(var(--accent))]">
    <CpuIcon className="block w-16 h-16 md:w-20 md:h-20" />
  </div>
                </CardContent>
              </Card>
            </button>

            {/* RIGHT SUMMARY CARD */}
            <Card className="lg:w-4/5 w-full min-w-md:max-w-lg justify-center flex md:flex-row flex-col items-center m-3 build-container">
              <CardContent className='p-0 w-full h-full'>
                {props.processorId ? (
                  <div className="build-container hover:bg-[hsl(var(--card)/0.08)] transition flex md:flex-row flex-col justify-between group items-center rounded-xl space-x-3">
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
                      <p className="font-semibold text-sm text-foreground">{props.processorId.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {showFullDescription
                          ? (props.processorId.description || '')
                          : `${(props.processorId.description || '').slice(0, 100)}...`}
                        {(props.processorId.description || '').length > 100 && (
                          <span className="font-bold cursor-pointer text-[hsl(var(--accent))]" onClick={toggleDescription}>
                            {showFullDescription ? ' See Less' : ' See More'}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Compatibilité */}
                    {props.selectedCompatibility ? (
                      <div className="w-4/5">
                        <div className='font-bold my-2 text-sm text-foreground'>Compatibility:</div>

                        <div className="text-left grid text-xs max-w-screen-md mx-auto border border-border rounded mb-3 mr-3">
                          <div className="p-1 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.motherboardCompatibility.error ? 'text-red-400' : 'text-green-400'}`}>Motherboard:</p>
                            <p className={props.selectedCompatibility.Compatibility.motherboardCompatibility.error ? 'text-red-400' : 'text-green-400'}>{props.selectedCompatibility.Compatibility.motherboardCompatibility.message}</p>
                          </div>
                          <div className="p-1 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-400' : 'text-green-400'}`}>Processor:</p>
                            <p className={props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-400' : 'text-green-400'}>{props.selectedCompatibility.Compatibility.processorCompatibility.message}</p>
                          </div>
                          <div className="p-1 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.gpuCompatibility.error ? 'text-red-400' : 'text-green-400'}`}>Graphics card:</p>
                            <p className={props.selectedCompatibility.Compatibility.gpuCompatibility.error ? 'text-red-400' : 'text-green-400'}>{props.selectedCompatibility.Compatibility.gpuCompatibility.message}</p>
                          </div>
                          <div className="p-1 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.ramCompatibility.error ? 'text-red-400' : 'text-green-400'}`}>RAM :</p>
                            <p className={props.selectedCompatibility.Compatibility.ramCompatibility.error ? 'text-red-400' : 'text-green-400'}>{props.selectedCompatibility.Compatibility.ramCompatibility.message}</p>
                          </div>
                          <div className="p-1 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-400' : 'text-green-400'}`}>Hard drive compatibility:
</p>
                            <p className={props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-400' : 'text-green-400'}>{props.selectedCompatibility.Compatibility.hardDiskCompatibility.message}</p>
                          </div>
                          <div className="p-1 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-400' : 'text-green-400'}`}>Power supply box compatibility:
</p>
                            <p className={props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-400' : 'text-green-400'}>{props.selectedCompatibility.Compatibility.powerCompatibility.message}</p>
                          </div>
                          <div className="p-1 pl-3 hover:bg-secondary/40 hover:font-bold cursor-pointer">
                            <p className={`mb-1 ${props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-400' : 'text-green-400'}`}>Case compatibility:
</p>
                            <p className={props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-400' : 'text-green-400'}>{props.selectedCompatibility.Compatibility.caseCompatibility.message}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Price & actions */}
                    <div className="flex-shrink-0 p-3">
                      <div className='text-center flex flex-col'>
                        <div className='p-3'>
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
                        <Button onClick={() => steOpenDialog(true)} className="bg-[hsl(var(--accent))] text-black hover:bg-secondary/40 border border-white">
                          {ui.builderBtnChange}
                        </Button>
                        <a href={"product/"+props.processorId.id} className='underline mt-2 text-[#00e0ff]' target='_blank'>
                        {ui.builderLinkSeeInStore}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => steOpenDialog(true)} className="cursor-pointer w-full h-full flex justify-center items-center text-[hsl(var(--accent))]">
                   <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 44 55" className="fill-current text-[hsl(var(--accent))]">
                    <path d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1s-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8c0,0.6,0.5,1,1,1s1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z" />
                   </svg>
                   </div>

                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG — compact layout */}
      <Dialog open={openDialog} onOpenChange={steOpenDialog}>
      <DialogContent   id="component-dialog" className="w-[95vw] max-w-[1200px]
                                h-[85vh] md:h-[80vh]
                                p-0 overflow-hidden
                                 flex flex-col
                                 bg-[#101218] text-[#e6e8ee]
                                 border border-border rounded-2xl
                                               ">
      
          {/* Sticky header */}
          <DialogHeader className="sticky top-0 z-10 bg-[#101218] border-b border-border px-4 py-3">
            <DialogTitle>
              <div className='flex justify-between items-center'>
                <h1>Processor store</h1>
                <Menu as="div" className="relative inline-block text-left">
                  <div className='flex'>
                    <Menu.Button className="group inline-flex items-center text-sm font-medium">
                      Sort&nbsp;<span className='text-foreground'>{selectedSort}</span>
                      <ChevronDownIcon className="ml-1 h-5 w-5 text-foreground/70" aria-hidden="true" />
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
                                onClick={() => { setSelectedSort(option.name); setCurrentPage(0) }}
                                className={classNames(
                                  option.current ? 'cursor-pointer text-[#00e0ff] font-medium' : 'cursor-pointer text-foreground/70',
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
            {/* FILTERS PANEL */}
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

              {props.processorModel.list.length > 0 && (
                <>
                  {props.motherboardId ? (
                    <div className='mt-2'>
                      <label className='text-sm inline-flex items-center gap-2'>
                        <Input
                          type='checkbox'
                          className='w-3 h-3 m-0'
                          checked={compatible}
                          onChange={(e) => setcompatible(e.target.checked)}
                        />
                        Compatible with Motherboard
                      </label>
                    </div>
                  ) : null}

{Object.entries(props).map(([filterKey, filter]) => {
  if (filterKey === "processorModel") {
    const filterData = filter as Filter;
    return (
      <CheckboxGroup
        key={filterKey}
        label={filterData.title.toString()}
        items={filterData.list}
        onChange={(value) =>
          handleCheckboxChange("processorModel", value)
        }
        selectedItems={filterList.processorModel.map(
          (item) => item.searchKey
        )}
      />
    );
  }

  if (filterKey === "cPUSupport") {
    const filterData = filter as Filter;
    const filteredItems = getFilteredCpuSupportItems(
      filterData.list,
      filterList.processorModel
    );

    return (
      <CheckboxGroup
        key={filterKey}
        label={filterData.title.toString()}
        items={filteredItems}
        onChange={(value) =>
          handleCheckboxChange("cPUSupport", value)
        }
        selectedItems={filterList.cPUSupport.map(
          (item) => item.searchKey
        )}
      />
    );
  }

  return null;
})}


                </>
              )}
            </div>

            {/* RESULTS GRID */}
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
                  {!loading && data && data.length === 0 && <p className="text-foreground/70">{ui.builderNoResults}.</p>}

                  {!loading && data.length > 0 && (
                    <>
                      <div className='text-xs text-foreground/70 mb-2'>({totalPages}) {ui.builderResultsSummary(totalPages, searchTime)}</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {data.map((item, key) => (
                          <div
                            key={key}
                            className={`${checkcompatibility(item) ? 'ring-1 ring-[hsl(var(--accent))]/50' : 'ring-1 ring-red-500/40'} bg-[#12141b] hover:bg-[#101218] transition flex flex-col justify-between group cursor-pointer rounded-xl border border-border p-3 space-y-1 text-foreground`}
                          >
                            <div>
                              {extractCoreCount(item.description || '') === recommendedcpuclock && (
                                <span className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-2 py-0.5 rounded-full text-xs font-semibold w-fit">
                                  Recommended by AI
                                </span>
                              )}
                              <div className="aspect-square rounded-xl bg-transparent relative">
                                <Image
                                  src={item.images?.[0]?.url || ''}
                                  alt=""
                                  fill
                                  className="aspect-square object-cover rounded-md"
                                />
                              </div>
                              <div className="mt-2">
                                <p className="font-semibold text-sm text-foreground leading-tight">{item.name}</p>
                                <p className="text-xs text-foreground/70">{item.category?.name}</p>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-1">
                                <Currency value={item?.price} />
                              </div>
                            </div>

                            <div className='w-full'>
                              
                                  <InlineDetails text={item.description} />

                                
                                
                              <Button
                                type='submit'
                                onClick={() => { props.setProcessorId(item); steOpenDialog(false) }}
                                className={'w-full ' + `${checkcompatibility(item) ? 'bg-primary text-foreground hover:bg-primary/90' : 'bg-red-500 hover:bg-red-600 text-foreground'}`}
                              >
                                {ui.builderBtnAdd}
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
  {ui.filterButton}
</Button>

              </div>

              <div className='col-span-12 md:col-span-8 lg:col-span-9 flex justify-end'>
                {totalPages > 0 && !loading && data.length > 0 && (
                  <Pagination
                    isCompact
                    showControls
                    total={parseInt((totalPages / 10).toFixed(0)) + (totalPages % 10 === 0 ? 0 : 1)}
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

// Checkbox group (inherits theme)
const CheckboxGroup = (props: {
  label: string;
  items: filterItem[];
  onChange: (value: string) => void;
  selectedItems: string[];
}) => {
  return (
    <div className="text-foreground">
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
            <label className='text-sm text-foreground/70'>
              {item.name} ({item.number})
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};
