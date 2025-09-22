"use client"
import prismadb from '@/lib/prismadb'
import { CPUSupport, CompatibiltyProfile, ComponentOnPc, Product } from '@prisma/client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductCOl from './motherboard'

import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'
import { ProdCol } from '@/types'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export type motherboardata={
    products:Product[]
    cpusupport:CPUSupport
  }
  type ramSlot={
    rams: ProdCol[];
  }
  type DiskSlot={
    disk: ProdCol[];
  }
interface ProductFormProps {
    initialData: CompatibiltyProfile & {
      cases: ComponentOnPc[],
      CPUs:ComponentOnPc[],
   
      GPUs:ComponentOnPc[],
      motherboards:ComponentOnPc[],
      powersupplys:ComponentOnPc[],
      RAMs: { Components: ComponentOnPc[] }[];
      disks:{ Components: ComponentOnPc[] }[],
    } | null;
  
    motherboards: ProdCol[];
    cpus: ProdCol[];
    gpus: ProdCol[];
    rams: ProdCol[];
    diks: ProdCol[];
    powersupplies: ProdCol[]
    cases: ProdCol[];
    motherboardData: motherboardata[]
    cpuData: motherboardata[]
  };

  
const formSchema = z.object({
    motherboards: z.object({ id: z.string() }).array(),
  
    selectionStatu:z.object({ 
      motherboardIsSelected: z.boolean().default(false).optional(),
      cpuIsSelected:         z.boolean().default(false).optional(),
      gpuIsSelected:         z.boolean().default(false).optional(),
      ramIsSelected:         z.boolean().default(false).optional(),
      caseIsSelected:        z.boolean().default(false).optional(),
      diskIsSelected:        z.boolean().default(false).optional(),
      powerIsSelected:      z.boolean().default(false).optional(), })
  });
  
  type ProductFormValues = z.infer<typeof formSchema>

const Pctemplate: React.FC <ProductFormProps> = ({
    initialData,
    motherboards,
    cpus,
    gpus,
    rams,
    diks,
    powersupplies,
    cases,
    motherboardData,
    cpuData
  }) =>  {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const title = initialData ? 'Edit product' : 'Create product';
    const description = initialData ? 'Edit a product.' : 'Add a new product';
    const toastMessage = initialData ? 'Product updated.' : 'Product created.';
    const action = initialData ? 'Save changes' : 'Create';
  
    const defaultValues = initialData ? {
      ...initialData,
      selectionStatu: {
        motherboardIsSelected: initialData.motherboards.length>0,
        cpuIsSelected:          initialData.motherboards.length>0,
        gpuIsSelected:          initialData.motherboards.length>0,
        ramIsSelected:          initialData.motherboards.length>0,
        caseIsSelected:         initialData.motherboards.length>0,
        diskIsSelected:         initialData.motherboards.length>0,
        powerIsSelected:         initialData.motherboards.length>0,
      }
    } : {
      selectionStatu: {
        motherboardIsSelected: false,
        cpuIsSelected:         false,
        gpuIsSelected:         false,
        ramIsSelected:         false,
        caseIsSelected:        false,
        diskIsSelected:        false,
        powerIsSelected:       false
      }
    }
  
    const form = useForm<ProductFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues
    });
  
   
  
    const onDelete = async () => {
     
    }
  
    const [selectionStatu, setSelectionStatu] = useState<buildPcSelection>(defaultValues.selectionStatu)
   
    const [mbs,setMbs]=useState<ProdCol[]>(motherboards.filter((e)=>initialData?.motherboards.find((ee)=>e.id==ee.productId)))
    const [cpu,setcpu]=useState<ProdCol[]>(cpus.filter((e)=>initialData?.CPUs.find((ee)=>e.id==ee.productId)))
    const [gpu,setgpu]=useState<ProdCol[]>(gpus.filter((e)=>initialData?.GPUs.find((ee)=>e.id==ee.productId)))
    const [power,setPower]=useState<ProdCol[]>(powersupplies.filter((e)=>initialData?.powersupplys.find((ee)=>e.id==ee.productId)))
    const [ramSlot,setramslot]=useState<ramSlot[]>(initialData?.RAMs.map((ee)=>({
      rams:rams.filter((e)=>ee.Components.find((x)=>x.productId==e.id))
    }))??[{rams:[]}])
    const [casesl,setcase]=useState<ProdCol[]>(cases.filter((e)=>initialData?.cases.find((ee)=>e.id==ee.productId)))
    const [DiskSlot,setDiskSlot]=useState<DiskSlot[]>(initialData?.disks.map((ee)=>({
      disk:diks.filter((e)=>ee.Components.find((x)=>x.productId==e.id))
    }))??[{disk:[]}])
  
const [LastmotherboardId,setLastMotherBoardId]=useState("")
const [motherboardId,setMotherBoardId]=useState("")
  const [name,setName]=useState(initialData?.name??'')
  return (
     
    <div>pc-template
       
           <ProductCOl init={mbs} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId}  colname="mb" motherboards={motherboards}  updateList={(e)=>setPower(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />


      {motherboards.map((i)=><>
      {i.id}
      </>)}

    </div>
  )
}

export default Pctemplate