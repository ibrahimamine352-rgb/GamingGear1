"use client"

import * as z from "zod"
const axios = require("axios");
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { CPUSupport, Category, CompatibiltyProfile, Gpu, Harddisk, Image, Memory, Motherboard, PCcase, Powersupply, Processor, Product } from "@prisma/client"
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


interface ProductFormProps {
  initialData: CompatibiltyProfile & {

  } | null;

  motherboards: ProdCol[];
  cpus: ProdCol[];
  gpus: ProdCol[];
  rams: ProdCol[];
  diks: ProdCol[];
  powersupplies: ProdCol[]
  cases: ProdCol[];
  motherboardData: Product[]& {
    cpusupport:CPUSupport
  } | null;
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
  motherboardData
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
      motherboardIsSelected: false,
      cpuIsSelected:         false,
      gpuIsSelected:         false,
      ramIsSelected:         false,
      caseIsSelected:        false,
      diskIsSelected:        false,
      powerIsSelected:        false,
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

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/products`, data);
      }
      router.refresh();
      router.push(`/admin/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

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
  const [mbs,setMbs]=useState<ProdCol[]>([])
  const [cpu,setcpu]=useState<ProdCol[]>([])
  const [gpu,setgpu]=useState<ProdCol[]>([])
  const [ram,setram]=useState<ProdCol[]>([])
  const [power,setPower]=useState<ProdCol[]>([])
  const [disk,setdisk]=useState<ProdCol[]>([])
console.log(motherboards)
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
            <div className='font-semibold'>Mother board</div>
            <MotherboardCOl colname="mb" motherboards={motherboards} updateList={(e)=>setMbs(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>

          <div>
            <div className='font-semibold'>Processor</div>
            <MotherboardCOl  colname="cpu" motherboards={cpus}  updateList={(e)=>setcpu(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>

          <div>
            <div className='font-semibold'>Graphic card</div>
            <MotherboardCOl  colname="gpu" motherboards={gpus}  updateList={(e)=>setMbs(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
          <div>
            <div className='font-semibold'>Power supply</div>
            <MotherboardCOl  colname="cpu" motherboards={powersupplies}  updateList={(e)=>setMbs(e)} selectionStaue={selectionStatu} onSlectionChange={(e)=>setSelectionStatu(e)} />

          </div>
          

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
