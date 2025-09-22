"use client"

import * as z from "zod"
const axios = require("axios");
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { CPUSupport, Category, ComponentOnPc, Image, PreBuiltPcmodel, Product, pcTemplate } from "@prisma/client"
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
import { ProdCol } from "@/types";
import Pctemplate from "./pc-template";

type Field = {
  name: string;
  value: string;
};

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array().min(1),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  dicountPrice: z.coerce.number().optional(),
  description: z.string().min(1),
  discountOnPc:z.coerce.number().min(1),
  stock: z.coerce.number().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  additionalDetails: z.object({ name: z.string(), value: z.string() }).array(),

});
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
type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: Product & {
    images: Image[]
    additionalDetails: Field[]
    PreBuiltPcmodel:PreBuiltPcmodel&{pcTemplate:pcTemplate}|null

  } | null;
  categories: Category[];

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

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  motherboards,
  cpus,
  gpus,
  rams,
  diks,
  powersupplies,
  cases,
  
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
    price: parseFloat(String(initialData?.price)),
    dicountPrice: parseFloat(String(initialData?.price)),
    stock: parseInt(String(initialData?.price)),
    additionalDetails: (initialData?.additionalDetails || []).map((item) => ({
      name: item.name,
      value: item.value
    })),

  } : {
    name: '',
    images: [],
    price: 0,
    categoryId: '',
    dicountPrice: 0,
    description: '',
    stock: 0,
    isFeatured: false,
    isArchived: false,
    additionalDetails: []
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log("data")


    if (mbs.length == 0) {
      toast.error('Add motherboard');
      return
    }
    if (cpu.length == 0) {
      toast.error('Add proccessors');
      return
    }
    if (gpu.length == 0) {
      toast.error('Add graphic card');
      return
    }
    if (power.length == 0) {
      toast.error('Add powersupplies');
      return
    }

    if (casesl.length == 0) {
      toast.error('Add cases');
      return
    }
    if (ramSlot.length == 0) {
      toast.error('Add rams');
      return

    }
    try {
      setLoading(true);
      const pct = {
        motherBoardId: mbs[0].id,
        processorId: cpu[0].id,
        graphicCardId: gpu[0].id,
        powerSupplyId: power[0].id,
        caseId: casesl[0].id,
        ramIdArray: ramSlot.map((e) => {
          return e.rams[0].id
        }),
        hardDiskArray: DiskSlot.map((e) => {
          return e.disk[0].id
        })
      }
      if (initialData) {
        await axios.patch(`/api/addPc/${params.productId}`, { ...data, ...pct });
      } else {
        await axios.post(`/api/addPc`, { ...data, ...pct });
      }
      router.refresh();
      router.push(`/admin/Build-pc`);
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
  const [parentInputArray, setParentInputArray] = useState<Array<{ name: string; value: string }>>([...defaultValues.additionalDetails.map((i) => ({ name: i.name, value: i.value })
  )]);

  const handleInputArrayChange = (inputArray: Array<{ name: string; value: string }>) => {
    setParentInputArray(inputArray);
    console.log(parentInputArray)
  };
  const [pcTemplate, setPcTemplate] = useState({})
  console.log(defaultValues.additionalDetails)




  const [mbs, setMbs] = useState<ProdCol[]>(motherboards.filter((e) => e.id==initialData?.PreBuiltPcmodel?.pcTemplate.motherBoardId))
  const [cpu, setcpu] = useState<ProdCol[]>(cpus.filter((e) => e.id==initialData?.PreBuiltPcmodel?.pcTemplate.processorId))
  const [gpu, setgpu] = useState<ProdCol[]>(gpus.filter((e) => e.id==initialData?.PreBuiltPcmodel?.pcTemplate.graphicCardId))
  const [power, setPower] = useState<ProdCol[]>(powersupplies.filter((e) =>e.id==initialData?.PreBuiltPcmodel?.pcTemplate.powerSupplyId))
  const [ramSlot, setramslot] = useState<ramSlot[]>(initialData?.PreBuiltPcmodel?.pcTemplate.ramIdArray.map((ee) => ({
    rams: rams.filter((e) => e.id==ee)
  })) ?? [{ rams: [] }])
  const [casesl, setcase] = useState<ProdCol[]>(cases.filter((e) =>e.id==initialData?.PreBuiltPcmodel?.pcTemplate.caseId))
  const [DiskSlot, setDiskSlot] = useState<DiskSlot[]>(initialData?.PreBuiltPcmodel?.pcTemplate.hardDiskArray.map((ee) => ({
    disk: diks.filter((e) => e.id==ee)
  })) ?? [{ disk: [] }])


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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dicountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DicountPrice</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="discountOnPc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>discount On Pc</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

          </div>


          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Infos</FormLabel>

                <FormControl>

                  <InputArray

                    onChange={(url: any[]) => field.onChange([...url])}
                    inputArrayp={field.value.map((i) => ({ name: i.name, value: i.value }))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>Total </div>
          <Pctemplate
            motherboards={motherboards}
            cpus={cpus}
            gpus={gpus}
            rams={rams}
            diks={diks}
            powersupplies={powersupplies}
            cases={cases}
            initialData={null}
            case1={casesl}
            cpu={cpu}
            disk={DiskSlot}
            gpu={gpu}
            mb={mbs}
            power={power}
            ram={ramSlot}
            setDiskSlot={setDiskSlot}
            setMbs={setMbs}
            setPower={setPower}
            setcase={setcase}
            setcpu={setcpu}
            setgpu={setgpu}
            setramslot={setramslot}

          />
          <Button onClick={() => {
            console.log(mbs, ramSlot, form)
          }} disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
