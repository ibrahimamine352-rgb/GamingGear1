"use client"

import * as z from "zod"
const axios = require("axios");
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { CPUSupport, Category, ComponentOnPc, ComponentOnPcGroupeEntityProfile, EntityProfile, Image, PreBuiltPcmodel, Product, pcTemplate } from "@prisma/client"
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
  price: z.coerce.number().min(0).optional(),
  categoryId: z.string().min(1),
  dicountPrice: z.coerce.number().optional(),
  description: z.string().min(1),
  discountOnPc: z.coerce.number().optional(),
  stock: z.coerce.number().min(0).optional(),
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

export interface ProductFormProps {
  initialData: Product & {
    images: Image[]
    FullPack: {
      id: number,
      Unity: ProdCol[],
      Screen: ProdCol[],
      Pack: ProdCol[],
      DefaultPack: String
      DefaultUnity: String
      DefaultScreen: String
      discountOnPack: number
    }[]


  } | null;
  categories: Category[];
  screens: ProdCol[]
  unities: ProdCol[]
  packs: ProdCol[]
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,

  screens, unities, packs

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
    images: initialData.images,
    price: parseFloat(String(initialData?.price)),
    dicountPrice: parseFloat(String(initialData?.dicountPrice)),
    stock: parseInt(String(initialData?.price)),
    discountOnPc: parseFloat(String(initialData?.FullPack[0].discountOnPack)),
    FullPack: {
      Unity: initialData.FullPack[0].Unity,
      Screen: initialData.FullPack[0].Screen,
      Pack: initialData.FullPack[0].Pack,
      DefaultPack: initialData.FullPack[0].DefaultPack,
      DefaultScreen: initialData.FullPack[0].DefaultScreen,
      DefaultUnity: initialData.FullPack[0].DefaultUnity,



    }
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
    additionalDetails: [],
    FullPack: {
      Unity: [],
      Screen: [],
      Pack: [],
      discountOnPack: 0,
      DefaultPack: "",
      DefaultScreen: "",
      DefaultUnity: "",
    }
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log("data")
    const dis = form.getValues('discountOnPc')

    try {
      setLoading(true);
      if (total)
        data.price = parseInt(total.toString())
      const pct = {
        prodid: initialData?.id,
        packid: initialData?.FullPack[0].id,
        Unity: unities,
        Pack: PackList,
        discountOnPack: dis,

        DefaultScreen: DefaultScreen,
        DefaultSpeaker: DefaultPack,
        DefaultUnity: DefaultUnity,
      }


      if (initialData) {
        await axios.patch(`/api/Pack/${params.productId}`, { ...data, ...pct });
      } else {
        await axios.post(`/api/Pack`, { ...data, ...pct });
      }
      router.refresh();
      router.push(`/admin/CustomPack`);
      toast.success(toastMessage);
    } catch (error: any) {

      toast.error('Something went wrong.');
      console.log(error)
    } finally {
      setLoading(false);
    }



  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/Pack/${params.productId}`);
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


  // const handleInputArrayChange = (inputArray: Array<{ name: string; value: string }>) => {
  //   setParentInputArray(inputArray);

  //   console.log(parentInputArray)
  // };
  const [pcTemplate, setPcTemplate] = useState({})



  const [screensList, setscreensList] = useState<ProdCol[]>(initialData && initialData.FullPack && initialData.FullPack[0].Screen
    ? screens.filter(e => initialData?.FullPack[0].Screen.find(ee => e.id === ee.id))
    : []);

  const [PackList, setPackList] = useState<ProdCol[]>(initialData && initialData.FullPack && initialData.FullPack[0].Pack
    ? packs.filter(e => initialData?.FullPack[0].Pack.find(ee => e.id === ee.id))
    : []);

  const [UnityList, setUnityList] = useState<ProdCol[]>(initialData && initialData.FullPack && initialData.FullPack[0].Unity
    ? unities.filter(e => initialData?.FullPack[0].Unity.find(ee => e.id === ee.id))
    : []);


  console.log(initialData?.FullPack[0].discountOnPack)

  const [DefaultPack, setDefaultPack] = useState<String>(initialData?.FullPack[0].DefaultPack ?? "")
  const [DefaultScreen, setDefaultScreen] = useState<String>(initialData?.FullPack[0].DefaultScreen ?? "")
  const [DefaultUnity, setDefaultUnity] = useState<String>(initialData?.FullPack[0].DefaultUnity ?? "")



  const [total, setTotal] = useState(initialData?.price ?? 0)
  const CalculeTotal = () => {
    let pr = 0

    if (DefaultPack.length > 0) {
      const prod = screensList.find((e) => e.id == DefaultPack)
      if (prod)
        pr += prod?.price

    }
    if (DefaultScreen.length > 0) {

      const prod = screensList.find((e) => e.id == DefaultScreen)
      if (prod)
        pr += prod?.price

    }

    if (DefaultPack.length > 0) {

      const prod = packs.find((e) => e.id == DefaultPack)
      if (prod)
        pr += prod?.price


    }

    const dis = form.getValues('discountOnPc')
    if (dis && dis > 0)
      pr = pr - dis
    setTotal(pr)
  }
  useEffect(() => {

    CalculeTotal()
  }, [
    form.watch('discountOnPc'),
    DefaultPack,
    DefaultScreen,
    DefaultUnity
  ])
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
                <FormItem className="hidden">
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
                <FormItem className="hidden">
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
              name="stock"
              render={({ field }) => (
                <FormItem className="hidden">
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
              <FormItem className="hidden">
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
          <div className="w-full fixed bottom-0 left-0 z-40 bg-white dark:bg-black border-t-small py-3 px-3">
            <div>Total : {total.toString()} TND</div>
            <FormField
              control={form.control}
              name="discountOnPc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>discount On Pc</FormLabel>
                  <FormControl>
                    <Input type="number" onKeyDown={(ke) => { if (ke.key == "Enter") { form.trigger() }; console.log(ke.key) }} disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button onClick={() => {

            }} disabled={loading} className="ml-auto my-3 w-full" type="submit">
              Product  {action}
            </Button>
          </div>


          <Pctemplate

            screens={screens}
            screensList={screensList}
            setDefaultScreen={setDefaultScreen}
            setscreensList={setscreensList}
            initialData={initialData}
            DefaultUnity={DefaultUnity}
            DefaultPack={DefaultScreen}
            DefaultScreen={DefaultScreen}
            setDefaultUnity={setDefaultUnity }
            setDefaultPack={setDefaultPack }
            UnityList={UnityList} 
            PackList={PackList}
            setUnityList={ setUnityList}
            setPackList={setPackList }
            unities={unities}
            packs={packs}
          />

        </form>
      </Form>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};
