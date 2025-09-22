"use client"
import prismadb from '@/lib/prismadb'
import { CPUSupport, CompatibiltyProfile, ComponentOnPc, Product } from '@prisma/client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import MotherboardCOl from "./motherboard";
import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'
import { ProdCol } from '@/types'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import ProductCOlRam from './Ram'

export type motherboardata = {
  products: Product[]
  cpusupport: CPUSupport
}
type ramSlot = {
  rams: ProdCol[];
}
type DiskSlot = {
  disk: ProdCol[];
}
interface ProductFormProps {
  initialData: Product & {
    FullPack: {
      id: number,
      Unity: ProdCol[],
      Screen: ProdCol[],
      Pack: ProdCol[],
      DefaultUnity: String
      DefaultPack: String
      DefaultScreen: String
      discountOnPack: number
    }[]


  } | null;
  DefaultUnity: String
  DefaultPack: String
  DefaultScreen: String
  setDefaultUnity: (ProdCol: String) => void
  setDefaultPack: (ProdCol: String) => void
  setDefaultScreen: (ProdCol: String) => void
  UnityList: ProdCol[]
  PackList: ProdCol[]
  screensList: ProdCol[]
  setUnityList: (ProdCol: ProdCol[]) => void
  setPackList: (ProdCol: ProdCol[]) => void
  setscreensList: (ProdCol: ProdCol[]) => void
  screens: ProdCol[]
  unities: ProdCol[]
  packs: ProdCol[]
};


const formSchema = z.object({
  motherboards: z.object({ id: z.string() }).array(),

  selectionStatu: z.object({
    motherboardIsSelected: z.boolean().default(false).optional(),
    cpuIsSelected: z.boolean().default(false).optional(),
    gpuIsSelected: z.boolean().default(false).optional(),
    ramIsSelected: z.boolean().default(false).optional(),
    caseIsSelected: z.boolean().default(false).optional(),
    diskIsSelected: z.boolean().default(false).optional(),
    powerIsSelected: z.boolean().default(false).optional(),
  })
});

type ProductFormValues = z.infer<typeof formSchema>

const Pctemplate: React.FC<ProductFormProps> = ({
  initialData,
  DefaultUnity,
  DefaultPack,
  DefaultScreen,
  setDefaultUnity,
  setDefaultPack,
  setDefaultScreen,
  UnityList,
  PackList,
  screensList,
  setUnityList,
  setPackList,
  setscreensList,
  screens,
  packs,
  unities
}) => {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Edit a product.' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
    selectionStatu: {
      motherboardIsSelected: false,
      cpuIsSelected: false,
      gpuIsSelected: false,
      ramIsSelected: false,
      caseIsSelected: false,
      diskIsSelected: false,
      powerIsSelected: false,
      coolingIsSelected: false
    }
  } : {
    selectionStatu: {
      motherboardIsSelected: false,
      cpuIsSelected: false,
      gpuIsSelected: false,
      ramIsSelected: false,
      caseIsSelected: false,
      diskIsSelected: false,
      powerIsSelected: false,
      coolingIsSelected: false
    }
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });



  const onDelete = async () => {

  }

  const [selectionStatu, setSelectionStatu] = useState<buildPcSelection>(defaultValues.selectionStatu)


  const [LastmotherboardId, setLastMotherBoardId] = useState("")
  const [motherboardId, setMotherBoardId] = useState("")
  const [name, setName] = useState(initialData?.name ?? '')
  return (
    <>
      <div>   <div className='font-semibold'>Unity</div>
        <MotherboardCOl init={UnityList} MotherBoardId={DefaultUnity} setMotherBoardId={setDefaultUnity} lastMotherBoardId={LastmotherboardId} colname="mb" motherboards={unities} updateList={(e) => setUnityList(e)} selectionStaue={selectionStatu} onSlectionChange={(e) => setSelectionStatu(e)} />
      </div>
      <div>
        <div className='font-semibold'>screens</div>
        <MotherboardCOl init={screensList} MotherBoardId={DefaultScreen} setMotherBoardId={setDefaultScreen} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={screens} updateList={(e) => setscreensList(e)} selectionStaue={selectionStatu} onSlectionChange={(e) => setSelectionStatu(e)} />
      </div>
      <div>
        <div className='font-semibold'>Pack</div>
        <MotherboardCOl init={PackList} MotherBoardId={DefaultPack} setMotherBoardId={setDefaultPack} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={packs} updateList={(e) => setPackList(e)} selectionStaue={selectionStatu} onSlectionChange={(e) => setSelectionStatu(e)} />
      </div>

    </>


  )
}

export default Pctemplate