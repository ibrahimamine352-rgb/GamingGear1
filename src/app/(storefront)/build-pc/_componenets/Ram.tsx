"use client"
import { XMarkIcon } from '@heroicons/react/24/outline'
import { RamIcon } from "./comps"
import React, { MouseEventHandler, useEffect, useState, Fragment } from 'react'
import { Button } from "@/components/ui/button"
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
import Image from 'next/image'
import Currency from '@/components/ui/currency'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { Pagination } from '@nextui-org/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Trash } from 'lucide-react'
import { toast } from "react-hot-toast"
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";

import { AllProductsCompatibility } from './comps'
import { MemoryFrequency, MemoryNumber, MemoryType } from '@prisma/client'
import type { SelectedFeatures } from './BuildForm' // type-only (no runtime import)

// local copy so we don't import any *value* from BuildForm
const extractNumber = (text: string): number | null => {
  const m = text.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
};
import { getRecommendations } from './getRecommendations'
import type { Product } from "@/types"
import type { Filter, ProfileType, filterItem } from '../page'

type checkItem = { id: number, searchKey: string }
function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
type SetRams = (callback: (prevRams: Array<Memory | null>) => Array<Memory | null>) => void;
type m = { frequency: MemoryFrequency, number: MemoryNumber, type: MemoryType }
export type Memory = Product & { memories: m[] }
type reslt = { data: Memory[]; total: number }
export type checkItemGroupsRam = {
  memoryFrequency: checkItem[],
  memoryMarque: checkItem[],
  memoryNumber: checkItem[],
  memoryType: checkItem[],
}

type YourComponentProps = {
  rams: (Memory | null)[]
  setRams: SetRams
  removeFeature:(featureName:string) => void
  addFeature:(featureName:string, value:any)=> void
  selectedFeatures:SelectedFeatures
  selectedCompatibility: AllProductsCompatibility | null
  setMotherboardId: (values: Product) => void
  motherboardId: Product | undefined
  profiles: ProfileType[]
  setCompatibility: (value: Record<string, { message: string; error: boolean }>) => void
  memoryMarque: Filter
  memoryFrequency: Filter
  memoryNumber: Filter
  memoryType: Filter
  ramSlotNumber:number
  ramSlotType:string
}

export const Ram: React.FC<YourComponentProps> = (props) => {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];
  const [data, setData] = useState<Memory[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [recommendedram, setRecommendedram] = useState<number | undefined>(undefined)

  const [filterList, setFilterList] = useState<checkItemGroupsRam>({
    memoryFrequency: [],
    memoryMarque: [],
    memoryNumber: [],
    memoryType: [],
  })
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000])
  const [compatible, setcompatible] = useState(false)
  const [selectedSort, setSelectedSort] = useState('Prix : Croissant')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTime, setSearchTime] = useState(0)

  const sortOptions = [
    { name: 'Les plus populaires', href: '#', current: selectedSort === 'Les plus populaires' },
    { name: 'Les plus récents', href: '#', current: selectedSort === 'Les plus récents' },
    { name: 'Prix : Croissant', href: '#', current: selectedSort === 'Prix : Croissant' },
    { name: 'Prix : Décroissant', href: '#', current: selectedSort === 'Prix : Décroissant' },
  ]

  const fetchData = async () => {
    try {
      setLoading(true)
      const encodedFilterList = encodeURIComponent(JSON.stringify(filterList))
      const startTime = performance.now()
      const response = await fetch(
        `/api/memory/component?q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ''}`
      )
      const dataa = await response.json() as reslt
      const endTime = performance.now()
      setSearchTime((endTime - startTime) / 1000)

      setData(dataa.data)
      setTotalPages(dataa.total)
      setLoading(false)

      const res = await getRecommendations(props.selectedFeatures)
      setRecommendedram(res.recommendations[0].memorySpeed)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
    }
  }

  const handleCheckboxChange = (filterKey: keyof checkItemGroupsRam, value: string) => {
    setFilterList((prev) => {
      const i = prev[filterKey].findIndex((item) => item.searchKey === value)
      if (i !== -1) prev[filterKey].splice(i, 1)
      else prev[filterKey].push({ id: Date.now(), searchKey: value })
      return { ...prev }
    })
  }

  const handleSortClick = (name: React.SetStateAction<string>) => setSelectedSort(name)
  useEffect(() => { fetchData() }, [currentPage, selectedSort])
  useEffect(() => { fetchData() }, [])

  function haveCommonElement<T>(set1: T[], array2: T[]): boolean {
    const array1 = Array.from(set1)
    for (const item of array1) if (array2.includes(item)) return true
    return false
  }

  const checkcompatibility = (product: Product) => {
    const mb = props.motherboardId
    if (mb) {
      const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == mb.id))
      const PProfiles = props.profiles.filter((e) => e.RAMs.find((ee) => ee.Components.find((zz) => zz.productId == product.id)))
      return haveCommonElement(MProfiles, PProfiles)
    }
    return true
  }

  const [openDialog, steOpenDialog] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const toggleDescription = () => setShowFullDescription(!showFullDescription)
  const [openedramSlot, setopenedramSlot] = useState(0)

  useEffect(() => {
    const updates: Record<string, { message: string; error: boolean }> = {}
    const messages: string[] = []
    if (props.motherboardId) {
      props.rams.forEach((e, k) => {
        if (e != null) {
          if (e.memories[0].type.name === props.ramSlotType) {
            messages.push('Compatible')
          } else {
            messages.push(props.ramSlotType + ' à ' + k + ' est requis')
          }
        }
      })
    }
    if (messages.length > 0) {
      const notCompat = messages.filter((e) => e !== 'Compatible')
      updates['ramCompatibility'] = notCompat.length === 0
        ? { message: 'Compatible', error: false }
        : { message: messages.join(""), error: true }
    } else {
      updates['ramCompatibility'] = { message: 'Please select at least one RAM module', error: true }
    }
    props.setCompatibility(updates)
  }, [props.rams, props.motherboardId, props.ramSlotType, props.setCompatibility])

  const addEmptyCase = () => props.setRams((prev) => [...prev, null])
  const add2EmptyCase = () => props.setRams((prev) => [...prev, null, null])

  const updateCase = (index: number, item: Memory | null) => {
    props.setRams((prev) => {
      const updated = [...prev]
      updated[index] = item
      return updated
    })
    if (item) props.addFeature("Memory_Speed", extractNumber(item.memories[0].frequency.name))
  }

  const updateonecasefortwocase = (index: number, item: Memory | null) => {
    props.setRams((prev) => {
      const updated = [...prev, null]
      updated[index] = item
      return updated
    })
    if (item) props.addFeature("Memory_Speed", extractNumber(item.memories[0].frequency.name))
  }

  const updatewithremove2case = (index: number, item: Memory | null) => {
    props.setRams((prev) => {
      const updated = [...prev]
      updated[index] = item
      const idx = updated.indexOf(null)
      if (idx !== -1) updated.splice(idx, 1)
      return updated
    })
  }

  function extractLesserNumber(memoryString: string): number | null {
    const s = memoryString.replace(/\s/g, '')
    const match = s.match(/\b(\d+)X(\d+)/i)
    if (!match) return null
    return Math.min(parseInt(match[1], 10), parseInt(match[2], 10))
  }
  const is2caseProduct = (item: Memory) => extractLesserNumber(item?.name) === 2

  const updateElementAtIndex = (ind: number, newVe: Memory | null) => {
    const index = ind
    const newValue = newVe
    const prvprod = props.rams[index]
    if (newValue === null) {
      if (prvprod && is2caseProduct(prvprod)) { updateCase(index, null); addEmptyCase() }
      else { updateCase(index, null) }
    } else if (prvprod === null) {
      if (is2caseProduct(newValue)) {
        if (props.rams.filter((e) => e === null).length >= 2) {
          updatewithremove2case(index, newValue); toast.success('Ce produit a 2 barrettes RAM')
        } else {
          toast.error('This product has 2 RAM slots, please free up another RAM slot.1')
        }
      } else { updateCase(index, newValue) }
    } else {
      if (prvprod && is2caseProduct(prvprod) && !is2caseProduct(newValue)) {
        updateonecasefortwocase(index, newValue)
      } else {
        if (props.rams.filter((e) => e === null).length >= 1) {
          updateCase(index, newValue); toast.success('Ce produit a 2 barrettes RAM')
        } else if (prvprod && is2caseProduct(prvprod)) {
          updateCase(index, newValue)
        } else {
          if (!is2caseProduct(prvprod) && !is2caseProduct(newValue)) updateCase(index, newValue)
          else toast.error('This product has 2 RAM slots, please free up another RAM slot.2')
        }
      }
    }
    if (newValue) props.addFeature("Memory_Speed", extractNumber(newValue.memories[0].frequency.name))
  }

  useEffect(() => {
    const filtered = props.rams.filter((e) => e != null) as Memory[]
    if (props.ramSlotNumber === 2) {
      let n = 0, i = 0
      const arr: (Memory | null)[] = []
      filtered.forEach((it) => { if (it && is2caseProduct(it) && n < 2) { n += 2; arr[i] = it; i++ } })
      filtered.forEach((it) => { if (it && !is2caseProduct(it) && n < 2) { n += 1; arr[i] = it; i++ } })
      if (i === 0) n = 1
      for (let Xy = i; Xy < 3 - n; Xy++) arr[Xy] = null
      props.setRams(() => [...arr])
    } else if (props.ramSlotNumber === 4) {
      let n = 0, i = 0
      const arr: (Memory | null)[] = []
      filtered.forEach((it) => { if (it && is2caseProduct(it) && n < 4) { n += 2; arr[i] = it; i++ } })
      filtered.forEach((it) => { if (it && !is2caseProduct(it) && n < 4) { n += 1; arr[i] = it; i++ } })
      for (let Xy = i; Xy < 5 - n; Xy++) arr[Xy] = null
      props.setRams(() => [...arr])
    }
  }, [props.ramSlotNumber, props.motherboardId]) // keep deps

  const ramCompatibility = (mem: Memory, index: number) => {
    let comp = false
    let message = "Please select at least one RAM module"
    const motherboardId = props.motherboardId
    if (motherboardId) {
      const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id))
      if (mem.memories[0].type.name === props.ramSlotType) {
        const RProfiles = props.profiles.filter((xe) => xe.RAMs.find((ee) => ee.Components.find((re)=>re.productId===mem.id)))
        if (haveCommonElement(MProfiles, RProfiles)) { message = 'Compatible'; comp = true }
        else { message = 'Non Compatible'; comp = false }
      } else {
        message = props.ramSlotType === '' ? 'chargement en cours' : 'Barrette RAM ' + props.ramSlotType + ' est requis'
        comp = false
      }
    }
    return { comp, message }
  }

  return (
    <div className="text-foreground">
      {props.motherboardId == null ? (
        <>
          <Card className="m-3 rounded-2xl build-container">
            <CardContent>
              <div className='flex lg:flex-row flex-col'>
                <button
                  onClick={() => steOpenDialog(true)}
                  className='lg:w-1/5 w-full min-w-md:max-w-lg m-3 bg-transparent border-transparent hover:bg-[hsl(var(--card)/0.08)] rounded-xl'
                >
                  <Card className="build-selector">
                    <CardHeader>
                      <CardTitle className='text-center'>
                      {ui.navRam}
                        <p className='text-xs text-muted-foreground p-1'>{ui.builderRequiredTag}</p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="flex items-center justify-center leading-none text-[hsl(var(--accent))]">
                    <RamIcon className="block w-16 h-16 md:w-20 md:h-20" />
                    </div>
                    </CardContent>
                  </Card>
                </button>

                <Card className="lg:w-4/5 w-full m-3 build-container">
                  <CardContent className='p-0 w-full h-full'>
                    {props.rams && props.rams[0] != null ? (
                      <div className="build-container hover:bg-[hsl(var(--card)/0.08)] transition flex justify-between group md:flex-row flex-col items-center rounded-xl">
                        <div className="flex-shrink-0">
                          <div className="aspect-square rounded-xl mt-3 ml-3 relative" style={{ height: '150px' }}>
                            <Image
                              src={props.rams[0]!.images?.[0]?.url}
                              alt=""
                              fill
                              className="aspect-square object-cover rounded-md h-full w-full"
                            />
                          </div>
                        </div>

                        <div className="flex-grow p-3">
                          <p className="font-semibold text-sm">{props.rams[0]!.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {showFullDescription ? props.rams[0]!.description : `${props.rams[0]!.description.slice(0, 100)}...`}
                            {props.rams[0]!.description.length > 100 && (
                              <span className="font-bold cursor-pointer text-[hsl(var(--accent))]" onClick={toggleDescription}>
                                {showFullDescription ? ' See Less' : ' See More'}
                              </span>
                            )}
                          </p>
                        </div>

                        {props.selectedCompatibility ? (
                          <div className="w-4/5">
                            <div className='font-bold my-2 text-sm'>Compatibility:</div>
                            <div className="text-left grid text-xs max-w-screen-md mx-auto border border-border rounded mb-3 mr-3">
                              <div className="p-2 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                  Processor:
                                </p>
                                <p className={props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                  {props.selectedCompatibility.Compatibility.processorCompatibility.message}
                                </p>
                              </div>
                              <div className="p-2 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.ramCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                  Ram  :
                                </p>
                                <p className={props.selectedCompatibility.Compatibility.ramCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                  {props.selectedCompatibility.Compatibility.ramCompatibility.message}
                                </p>
                              </div>
                              <div className="p-2 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                  Hard drive compatibility:

                                </p>
                                <p className={props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                  {props.selectedCompatibility.Compatibility.hardDiskCompatibility.message}
                                </p>
                              </div>
                              <div className="p-2 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                  Power supply box compatibility:

                                </p>
                                <p className={props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                  {props.selectedCompatibility.Compatibility.powerCompatibility.message}
                                </p>
                              </div>
                              <div className="p-2 pl-3 hover:bg-card/70 hover:font-bold cursor-pointer">
                                <p className={`mb-1 ${props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                  Case compatibility:

                                </p>
                                <p className={props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                  {props.selectedCompatibility.Compatibility.caseCompatibility.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="flex-shrink-0 p-3">
                          <div className='text-center flex flex-col'>
                            <div className='p-3'>
                              <Currency value={props.rams[0]!.price} />
                            </div>
                            <Button disabled={loading} variant="destructive" size="sm" onClick={() => updateElementAtIndex(0, null)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => steOpenDialog(true)}>
                              {ui.builderBtnChange}
                            </Button>
                            <a href="zz" className='underline mt-2 text-[#00e0ff]' target='_blank'>
                            {ui.builderLinkSeeInStore}
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => steOpenDialog(true)} className='cursor-pointer w-full h-full flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 44 55" className="fill-current text-[hsl(var(--accent))]">
                          <g><path  d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z" /></g>
                        </svg>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {props.rams.map((prod, k) => (
            <Card key={k} className="m-3 bg-[#0b0f16] border border-white/20">
              <CardContent>
                <div className='flex lg:flex-row flex-col'>
                  <button onClick={() => steOpenDialog(true)} className='lg:w-1/5 w-full min-w-md:max-w-lg m-3 bg-transparent border-transparent hover:bg-[hsl(var(--card)/0.08)] rounded-xl'>
                    <Card className="build-selector">
                      <CardHeader>
                        <CardTitle className='text-center'>
                          Emplacement Ram ({k + 1})
                          {props.rams.findIndex((e) => e !== null) != -1 ? null : (
                            <p className='text-xs text-muted-foreground p-1'>{ui.builderRequiredTag}</p>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='flex align-middle items-center justify-center text-[hsl(var(--accent))]'>
                          {/* SVG UNCHANGED */}
                          <svg fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="100" height="100">
                            <g><g>
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
        h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v1h-5v2h5v7.904
        c0,0.604-0.491,1.096-1.095,1.096H29.374c-0.445-1.724-2.013-3-3.874-3s-3.428,1.276-3.874,3H20.5V2h1.126
        c0.445,1.724,2.013,3,3.874,3s3.428-1.276,3.874-3h14.031C44.009,2,44.5,2.491,44.5,3.096V11z"/>
                              <path d="M32.5,6h-2v2h-1V6h-2v2h-1V6h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2V8h-2V6z M32.5,14h-8v-4h8V14z" />
                              <path d="M32.5,42h-2v2h-1v-2h-2v2h-1v-2h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2v-8h-2V42z M32.5,50h-8v-4h8V50z" />
                              <path d="M32.5,24h-2v2h-1v-2h-2v2h-1v-2h-2v2h-2v8h2v2h2v-2h1v2h2v-2h1v2h2v-2h2v-8h-2V24z M32.5,32h-8v-4h8V32z" />
                            </g></g>
                          </svg>
                        </div>
                      </CardContent>
                    </Card>
                  </button>

                  <Card className="lg:w-4/5 w-full m-3 build-container">
                    <CardContent className='p-0 w-full h-full'>
                      <div className='p-3 font-semibold text-foreground'>
                        {props.motherboardId ? <>The chosen motherboard has been accepted. ( {props.ramSlotNumber} {props.ramSlotType} ) barette Ram</> : null}
                      </div>

                      {prod ? (
                        <div className="build-container hover:bg-[hsl(var(--card)/0.08)] transition flex justify-between group md:flex-row flex-col items-center rounded-xl">
                          <div className="flex-shrink-0">
                            <div className="aspect-square rounded-xl mt-3 ml-3 relative" style={{ height: '150px' }}>
                              <Image
                                src={prod.images?.[0]?.url || ''}
                                alt=""
                                fill
                                className="aspect-square object-cover rounded-md h-full w-full"
                              />
                            </div>
                          </div>

                          <div className="flex-grow p-3 text-foreground">
                            <p className="font-semibold text-sm">{prod.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {showFullDescription ? prod.description : `${prod.description.slice(0, 100)}...`}
                              {prod.description.length > 100 && (
                                <span className="font-bold cursor-pointer text-[hsl(var(--accent))]" onClick={toggleDescription}>
                                  {showFullDescription ? ' See Less' : ' See More'}
                                </span>
                              )}
                            </p>
                          </div>

                          {props.selectedCompatibility ? (
                            <div className="w-4/5">
                              <div className='font-bold my-2 text-sm'>Compatibility:</div>
                              <div className="text-left grid text-xs max-w-screen-md mx-auto border border-border rounded mb-3 mr-3">
                                <div className="p-2 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                                  <p className={`mb-1 ${props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                    Processor:
                                  </p>
                                  <p className={props.selectedCompatibility.Compatibility.processorCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                    {props.selectedCompatibility.Compatibility.processorCompatibility.message}
                                  </p>
                                </div>

                                <div className="p-2 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                                  <p className={`mb-1 ${!ramCompatibility(prod, k).comp ? 'text-red-400' : 'text-primary'}`}>
                                    Ram ({k + 1}) :
                                  </p>
                                  <p className={!ramCompatibility(prod, k).comp ? 'text-red-400' : 'text-primary'}>
                                    {ramCompatibility(prod, k).message}
                                  </p>
                                </div>

                                <div className="p-2 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                                  <p className={`mb-1 ${props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                    Hard drive compatibility:

                                  </p>
                                  <p className={props.selectedCompatibility.Compatibility.hardDiskCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                    {props.selectedCompatibility.Compatibility.hardDiskCompatibility.message}
                                  </p>
                                </div>

                                <div className="p-2 pl-3 border-b border-border hover:bg-[hsl(var(--card)/0.08)] hover:font-bold cursor-pointer">
                                  <p className={`mb-1 ${props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                    Power supply box compatibility:

                                  </p>
                                  <p className={props.selectedCompatibility.Compatibility.powerCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                    {props.selectedCompatibility.Compatibility.powerCompatibility.message}
                                  </p>
                                </div>

                                <div className="p-2 pl-3 hover:bg-card/70 hover:font-bold cursor-pointer">
                                  <p className={`mb-1 ${props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-400' : 'text-primary'}`}>
                                    Case compatibility:

                                  </p>
                                  <p className={props.selectedCompatibility.Compatibility.caseCompatibility.error ? 'text-red-400' : 'text-primary'}>
                                    {props.selectedCompatibility.Compatibility.caseCompatibility.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          <div className="flex-shrink-0 p-3">
                            <div className='text-center flex flex-col'>
                              <div className='p-3'>
                                <Currency value={prod.price} />
                              </div>
                              <Button className='my-2' disabled={loading} variant="destructive" size="sm" onClick={() => updateElementAtIndex(k, null)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => steOpenDialog(true)} >
                                {ui.builderBtnChange}
                              </Button>
                              <a href="zz" className='underline mt-2 text-[#00e0ff]' target='_blank'>
                              {ui.builderLinkSeeInStore}
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => { setopenedramSlot(k); steOpenDialog(true) }} className='cursor-pointer w-full h-full flex justify-center items-center'>
                          <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 44 55" className="fill-current text-[hsl(var(--accent))]">
                            <g><path d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z" /></g>
                          </svg>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* DIALOG — compact layout */}
      <Dialog open={openDialog} onOpenChange={(o) => steOpenDialog(o)}>
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
                <h1>RAM module store</h1>
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
                                onClick={() => { handleSortClick(option.name); setCurrentPage(0) }}
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

              {props.memoryMarque.list.length > 0 && (
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
                    if (['memoryMarque', 'memoryFrequency', 'memoryType', 'memoryNumber'].includes(filterKey)) {
                      const filterData = filter as Filter
                      return (
                        <CheckboxGroup
                          key={filterKey}
                          label={filterData.title.toString()}
                          items={filterData.list}
                          onChange={(value) => handleCheckboxChange(filterKey as keyof checkItemGroupsRam, value)}
                          selectedItems={filterList[filterKey as keyof checkItemGroupsRam].map((item) => item.searchKey)}
                        />
                      )
                    }
                    return null
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
                  {data.length === 0 && <p className="text-[#a6adc8]">{ui.builderNoResults}.</p>}
                  {data.length > 0 && (
                    <>
                      <div className='text-xs text-[#a6adc8] mb-2'>({totalPages}) {ui.builderResultsSummary(totalPages, searchTime)}</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {data.map((item, key) => (
                          <div
                            key={key}
                            className={`bg-[#12141b] hover:bg-[#101218] transition flex flex-col justify-between group cursor-pointer rounded-xl border border-white/5 p-3 space-y-1 ${checkcompatibility(item) ? 'ring-1 ring-[#00e0ff]/50' : 'ring-1 ring-red-500/40'}`}
                          >
                            {/* Recommended badge */}
                            {extractNumber(item.memories[0].frequency.name) === recommendedram && (
                              <span className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-2 py-0.5 rounded-full text-xs font-semibold w-fit">
                                Recommended by AI
                              </span>
                            )}

                            <div>
                              <div className="aspect-square rounded-xl relative">
                                <Image
                                  src={item.images?.[0]?.url || ''}
                                  alt=""
                                  fill
                                  className="aspect-square object-cover rounded-md"
                                />
                              </div>
                              <div className="mt-2">
                                <p className="font-semibold text-sm leading-tight">{item.name}</p>
                                <p className="text-xs text-[#a6adc8]">{item.category?.name}</p>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-1">
                                <Currency value={item?.price} />
                              </div>
                            </div>

                            <div className='w-full'>
                            <InlineDetails text={item.description} />

                              <Button
                                type='submit'
                                disabled={item.stock == 0}
                                onClick={() => { updateElementAtIndex(openedramSlot, item); steOpenDialog(false) }}
                                className='w-full btn-primary-blue'
                              >
                                {item.stock == 0 ? 'Hors Stock' : ui.builderBtnAdd}
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
                    onChange={(e) => setCurrentPage(e - 1)}
                    classNames={{
                      wrapper: "gap-2",
                      item: "w-8 h-8 text-foreground bg-white/10 border border-white/20 hover:bg-white/20",
                      cursor: "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold shadow-[0_0_20px_hsl(var(--accent)/0.15)]",
                      prev: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
                      next: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20"
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

// Checkbox group with same palette
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
              className='appearance-none w-3 h-3 m-2'
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
