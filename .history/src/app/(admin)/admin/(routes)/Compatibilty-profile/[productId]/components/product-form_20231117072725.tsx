"use client"

import * as z from "zod"
const axios = require("axios");
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { CPUSupport, Category, CompatibiltyProfile, ComponentOnPc, ComponentOnPcGroupe, Gpu, Harddisk, Image, Memory, Motherboard, PCcase, Powersupply, Processor, Product } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/ui/image-upload"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea";
import Addtioanlinfos from "./addtioanlinfos";
import InputArray from "./addtioanlinfos";
import MotherboardCOl from "./motherboard";
import { ProdCol } from "@/types";

type Field = {
  name: string;
  value: string;
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

interface PcComponenets{
  motherboardIsSelected: boolean,
  cpuIsSelected:         boolean,
  gpuIsSelected:         boolean,
  ramIsSelected:         boolean,
  caseIsSelected:        boolean,
  diskIsSelected:        boolean,
}
type motherboardata={
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
export type buildPcSelection = {
  motherboardIsSelected: boolean,
  cpuIsSelected:         boolean,
  gpuIsSelected:         boolean,
  ramIsSelected:         boolean,
  caseIsSelected:        boolean,
  diskIsSelected:        boolean,
  powerIsSelected:       boolean,
}
export const ProductForm: React.FC<ProductFormProps> = ({
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
}) => {
  const params = useParams();
  const router = useRouter();

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
      await axios.delete(`/api/products/${params.productId}`);
      router.refresh();
      router.push(`/products`);
      toast.success('Product deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const [selectionStatu, setSelectionStatu] = useState<buildPcSelection>(defaultValues.selectionStatu)
  console.log(initialData)
  const [mbs,setMbs]=useState<ProdCol[]>(motherboards.filter((e)=>initialData?.motherboards.find((ee)=>e.id==ee.productId)))
  const [cpu,setcpu]=useState<ProdCol[]>(cpus.filter((e)=>initialData?.CPUs.find((ee)=>e.id==ee.productId)))
  const [gpu,setgpu]=useState<ProdCol[]>(gpus.filter((e)=>initialData?.GPUs.find((ee)=>e.id==ee.productId)))
  const [power,setPower]=useState<ProdCol[]>(powersupplies.filter((e)=>initialData?.powersupplys.find((ee)=>e.id==ee.productId)))
  const [ramSlot,setramslot]=useState<ramSlot[]>(initialData?.RAMs.map((ee)=>({
    rams:rams.filter((e)=>ee.Components.find((x)=>x.productId==e.id))
  }))??[{rams:[]}])
  const [casesl,setcase]=useState<ProdCol[]>(cpus.filter((e)=>initialData?.cases.find((ee)=>e.id==ee.productId)))
  const [DiskSlot,setDiskSlot]=useState<DiskSlot[]>(initialData?.disks.map((ee)=>({
    disk:diks.filter((e)=>ee.Components.find((x)=>x.productId==e.id))
  }))??[{disk:[]}])
console.log(motherboardData)
const [name,setName]=useState(initialData?.name??'')


const onSubmit = async () => {
  console.log('za')


  if(mbs.length==0){
    toast.error('Add motherboard');
    return
  }
  if(cpu.length==0){
    toast.error('Add proccessors');
    return
  }
  if(gpu.length==0){
    toast.error('Add graphic card');
    return
  }
  if(power.length==0){
    toast.error('Add powersupplies');
    return
  }
 
  if(casesl.length==0){
    toast.error('Add cases');
    return
  }
  if(ramSlot.length==0){
    toast.error('Add rams');
    return
  
  }
  if(name.length==0){
    toast.error('Add Profile Name');
    return
  }
let resul = true;
for (const key in ramSlot) {
  const ra = ramSlot[key].rams;
  const k = parseInt(key) + 1;
  if (ra.length === 0) {
    toast.error('Add rams in Ram slot ' + k);
    resul = false;
    return;
  }
}



  if(DiskSlot.length==0){
 
    toast.error('Add disks');
  }
  for (const key in DiskSlot) {
    const ra = DiskSlot[key].disk;
    const k = parseInt(key) + 1;
    if (ra.length === 0) {
      toast.error('Add disks in disk slot ' + k);
      resul = false;
      return;
    }
  }

 
  try {
    setLoading(true);
    const data={
      name:name,
      motherboardList:[...mbs.map((val)=>val.id)],
      processorList:[...cpu.map((val)=>val.id)],
      graphicCardList:[...gpu.map((val)=>val.id)],
      powersupplyList:[...power.map((val)=>val.id)],
      ramSlotList:[...ramSlot.map((val)=>({
        rams:val.rams.map((e)=>e.id)
      }))],
      storageList:[...DiskSlot.map((val)=>({
        disks:val.disk.map((e)=>e.id)
      }))],
      caseList:[...casesl.map((val)=>val.id)]
    }
    if (initialData) {
      await axios.patch(`/api/products/${params.productId}`, data);
    } else {
      await axios.post(`/api/compatibilityProfile`, data);
    }
    //router.refresh();
    //router.push(`/admin/products`);
    //  toast.success(toastMessage);
  } catch (error: any) {
   // toast.error('Something went wrong.');
  } finally {
    setLoading(false);
  }
};


const [LastmotherboardId,setLastMotherBoardId]=useState("")
const [motherboardId,setMotherBoardId]=useState("")
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          
 <div>
            <div className='font-semibold py-2'>Profile name</div>
           <Input onChange={(e)=>setName(e.target.value)} value={name} type="text" />
          </div>

          <div>
            <div className='font-semibold'>Mother board</div>
            <MotherboardCOl init={mbs} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId} setLastMotherBoardId={(e)=>setLastMotherBoardId(e.toString())} setMotherBoardId={(e)=>setMotherBoardId(e.toString())} colname="mb" motherboards={motherboards} updateList={(e)=>setMbs(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

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
            <MotherboardCOl init={casesl} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={cases}  updateList={(e)=>setcase(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
          <div>
          <div className='font-semibold my-3 flex items-center'>rams <Button onClick={()=>setramslot([...ramSlot,{rams:[]}])} variant={'outline'} className="mx-3">Add new Ram Slot</Button></div>
          {
            ramSlot.map((item,key)=>{
              return (<>
               <div>
            <div className='font-semibold flex items-center'>Ram slot {key+1}{ramSlot.length>1?<Button onClick={() => {
        const updatedRamSlot = ramSlot.filter((_, index) => index !== key);
        setramslot(updatedRamSlot);
      }} variant={'destructive'} className="mx-3"><Trash className="w-5" /></Button>:<></>} </div>
            <MotherboardCOl init={item.rams} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={rams}  updateList={(e)=>{
              
              let newram=[...ramSlot]
              newram[key].rams=e
              setramslot([...newram])
              console.log(newram)
              }} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
              </>)
            })
          }
          </div>
       
          <div>
          <div className='font-semibold my-3 flex items-center'>Disks <Button onClick={()=>setDiskSlot([...DiskSlot,{disk:[]}])} variant={'outline'} className="mx-3">Add new Disk Slot</Button></div>
          {
            DiskSlot.map((item,key)=>{
              return (<>
               <div>
            <div className='font-semibold flex items-center'>Disk slot {key+1}{DiskSlot.length>1?<Button onClick={() => {
        const updatedDiskSlot = DiskSlot.filter((_, index) => index !== key);
        setDiskSlot(updatedDiskSlot);
      }} variant={'destructive'} className="mx-3"><Trash className="w-5" /></Button>:<></>} </div>
            <MotherboardCOl init={mbs} MotherBoardId={motherboardId} lastMotherBoardId={LastmotherboardId} colname="cpu" motherboards={item.disk}  updateList={(e)=>{
              
              let newram=[...DiskSlot]
              newram[key].disk=e
              setDiskSlot([...newram])
              console.log(newram)
              }} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
              </>)
            })
          }
          </div>
       
          
        
          <Button disabled={loading} className="ml-auto" type="button" onClick={()=>onSubmit()}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
