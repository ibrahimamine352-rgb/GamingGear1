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
      case: ComponentOnPc[],
      CPU:ComponentOnPc[],
      GPU:ComponentOnPc[],
      motherboard:ComponentOnPc[],
      powersupply:ComponentOnPc[],
      RAM: { Components: ComponentOnPc[] }[];
      disk:{ Components: ComponentOnPc[] }[],
    } | null;
  
    motherboards: ProdCol[];
    cpus: ProdCol[];
    gpus: ProdCol[];
    rams: ProdCol[];
    diks: ProdCol[];
    powersupplies: ProdCol[]
    cases: ProdCol[];
    mb:ProdCol[]
    cpu:ProdCol[]
    gpu:ProdCol[]
    power:ProdCol[]
    case1:ProdCol[]
    ram:ramSlot[]
    disk:DiskSlot[]
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
    mb,
    cpu,
    gpu,
    power,
    case1,
    ram,
    disk
  }) =>  {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router= useRouter()
    const title = initialData ? 'Edit product' : 'Create product';
    const description = initialData ? 'Edit a product.' : 'Add a new product';
    const toastMessage = initialData ? 'Product updated.' : 'Product created.';
    const action = initialData ? 'Save changes' : 'Create';
  
    const defaultValues = initialData ? {
      ...initialData,
      selectionStatu: {
        motherboardIsSelected: initialData.motherboard.length>0,
        cpuIsSelected:          initialData.CPU.length>0,
        gpuIsSelected:          initialData.GPU.length>0,
        ramIsSelected:          initialData.RAM.length>0,
        caseIsSelected:         initialData.case.length>0,
        diskIsSelected:         initialData.disk.length>0,
        powerIsSelected:         initialData.powersupply.length>0,
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
   
   
const [LastmotherboardId,setLastMotherBoardId]=useState("")
const [motherboardId,setMotherBoardId]=useState("")
  const [name,setName]=useState(initialData?.name??'')
  return (
     <>
         <div>   <div className='font-semibold'>Motherboard</div>
           <MotherboardCOl init={mbs} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId}  colname="mb" motherboards={motherboards}  updateList={(e)=>setPower(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />
    </div>

    <div>
            <div className='font-semibold'>Processor</div>
            <MotherboardCOl init={cpu} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={cpus}  updateList={(e)=>setcpu(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>

          <div>
            <div className='font-semibold'>Graphic card</div>
            <MotherboardCOl init={gpu} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId}  colname="gpu" motherboards={gpus}  updateList={(e)=>setgpu(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
          <div>
            <div className='font-semibold'>Power supply</div>
            <MotherboardCOl init={power} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId}  colname="cpu" motherboards={powersupplies}  updateList={(e)=>setPower(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
          <div>
            <div className='font-semibold'>Cases</div>
            <MotherboardCOl init={case1} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={cases}  updateList={(e)=>setcase(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
          <div>
          <div className='font-semibold my-3 flex items-center'>rams <Button    type="button" onClick={()=>setramslot([...ramSlot,{rams:[]}])} variant={'outline'} className="mx-3">Add new Ram Slot</Button></div>
          {
            ram.map((item,key)=>{
              return (<>
               <div>
            <div className='font-semibold flex items-center'>Ram slot {key+1}{ramSlot.length>1?<Button    type="button" onClick={() => {
        const updatedRamSlot = ram.filter((_, index) => index !== key);
        setramslot(updatedRamSlot);
        router.refresh()
      }} variant={'destructive'} className="mx-3"><Trash className="w-5" /></Button>:<></>} </div>
            <MotherboardCOl init={item.rams} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={rams}  updateList={(e)=>{
              
              let newram=[...ramSlot]
              newram[key].rams=e
              setramslot([...newram])
             
              }} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
              </>)
            })
          }
          </div>
       
          <div>
          <div className='font-semibold my-3 flex items-center'>Disks <Button    type="button" onClick={()=>setDiskSlot([...DiskSlot,{disk:[]}])} variant={'outline'} className="mx-3">Add new Disk Slot</Button></div>
          {
            disk.map((item,key)=>{
              return (<>
               <div>
            <div className='font-semibold flex items-center'>Disk slot {key+1}{DiskSlot.length>1?<Button   type="button"  onClick={() => {
        const updatedDiskSlot = disk.filter((_, index) => index !== key);
        setDiskSlot(updatedDiskSlot);
        router.refresh()
      }} variant={'destructive'} className="mx-3"><Trash className="w-5" /></Button>:<></>} </div>
            <MotherboardCOl init={item.disk} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={diks}  updateList={(e)=>{
              
              let newram=[...DiskSlot]
              newram[key].disk=e
              setDiskSlot([...newram])
             
              }} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
              </>)
            })
          }
          </div>
       
     </>

    
  )
}

export default Pctemplate