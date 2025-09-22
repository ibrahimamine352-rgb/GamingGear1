"use client"
import prismadb from '@/lib/prismadb'
import { CompatibiltyProfile, ComponentOnPc, Product } from '@prisma/client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductCOl from './motherboard'

import { buildPcSelection, motherboardata } from '../../../Compatibilty-profile/[productId]/components/product-form'
import { ProdCol } from '@/types'

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
const Pctemplate: React.FC = async () => {

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
      try {
        setLoading(true);
        await axios.delete(`/api/compatibilityProfile/${params.productId}`);
        router.refresh();
        router.push(`/admin/Compatibilty-profile`);
        toast.success('Product deleted.');
      } catch (error: any) {
        toast.error('Something went wrong.');
      } finally {
        setLoading(false);
        setOpen(false);
      }
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
  
  const [name,setName]=useState(initialData?.name??'')
  return (
     
    <div>pc-template
       <ProductCOl motherboards={motherboards} init={[]} colname={"mb"} updateList={function (value: ProdCol[]): void {
        setMot(value)
          } } setMotherBoardId={undefined} MotherBoardId={''} lastMotherBoardId={"undefined"} selectionStaue={{
              motherboardIsSelected: false,
              cpuIsSelected: false,
              gpuIsSelected: false,
              ramIsSelected: false,
              caseIsSelected: false,
              diskIsSelected: false,
              powerIsSelected: false
          }} onSlectionChange={function (value: buildPcSelection): void {
             
          } } />

      {motherboards.map((i)=><>
      {i.id}
      </>)}

    </div>
  )
}

export default Pctemplate