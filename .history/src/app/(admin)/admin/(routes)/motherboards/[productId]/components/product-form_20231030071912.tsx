"use client"

import * as z from "zod"
const axios = require("axios");
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Category, Image, Product, Manufacturer, RamSlots, MotherboardChipset, CPUSupport, Guarantee, MotherboardFormat } from "@prisma/client"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextMenu } from "@/components/ui/context-menu";
import { PopFormModal } from "../../components/formtoupdate";
import { Textarea } from "@/components/ui/textarea";


const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  manufacturerId: z.string().min(1),
  ramslotsId: z.string().min(1),
  chipsetId: z.string().min(1),
  cpusupportId: z.string().min(1),
  formatId: z.string().min(1),
  motherboardFormat: z.string().optional(),
  manifacturername: z.string().optional(),
  ramslots: z.number().optional(),
  cpusupport:z.string().optional(),
  dicountPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(1),
  description:z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: Product & {
    images: Image[]
  } | null;
  categories: Category[];
  manufacturers: Manufacturer[];
  ramslots: RamSlots[];
  chipset: MotherboardChipset[];
  cpusupport: CPUSupport[]
  format: MotherboardFormat[]

};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories, manufacturers, ramslots, chipset, cpusupport, format
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
    dicountPrice: parseFloat(String(initialData?.dicountPrice)),
    stock: parseFloat(String(initialData?.stock)),
  } : {
    name: '',
    images: [],
    price: 0,
    dicountPrice:0,
    stock:0,
    description:'',
    categoryId: '',
    isFeatured: false,
    isArchived: false,

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
        await axios.post(`/api/motherboard/component`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success('Product deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = async () => {

    if (form.getValues().manifacturername) {
      try {
        const name = form.getValues().manifacturername
        setLoading(true);

        await axios.post(`/api/motherboard/manufacturer`, { name, imageUrl: "" });

        toast.success(toastMessage);
        router.refresh();
        setIsDialogOpen(false);
      } catch (error: any) {
        toast.error('Something went wrong.');
        setIsDialogOpen(false);
      } finally {
        setLoading(false);
        setIsDialogOpen(false);
      }
    } else {
      form.setError('manifacturername', { message: 'Insert the name' });
      setIsDialogOpen(false);
    }




  };
  const [manifacturerimg, setmanifacturerimg] = useState<string[]>([]);
  const [manifacturerimgdrop, setmanifacturerimgdrop] = useState(false);
  const manufacturerImg = () => {
    console.log(manufacturers)
    if (form.getValues().manufacturerId) {
      setmanifacturerimgdrop(true)
    } else {
      setmanifacturerimgdrop(false)
    }
    const selectedManufacturerId = form.getValues().manufacturerId;

    // Find the manufacturer with the matching ID
    const img = manufacturers.find((manufacturer) => manufacturer.id === selectedManufacturerId);

    if (img && img.imageUrl.length > 0) {
      // Set the 'manifacturerimg' state with the image URL
      setmanifacturerimg([img.imageUrl]);
    }
    else {
      setmanifacturerimg([]);
    }

  };
  const uploadImg = async (url: string) => {

    if (url.length > 0) {
      try {
        const selectedManufacturerId = form.getValues().manufacturerId
        const name = manufacturers.find((manufacturer) => manufacturer.id === selectedManufacturerId)?.name
        setLoading(true);

        let data = {
          imageUrl: url,
          name: name
        }
        await axios.patch(`/api/motherboard/manufacturer/${form.getValues().manufacturerId}`, data);

        toast.success(toastMessage);

        setmanifacturerimg([url])
        router.refresh();
        setIsDialogOpen(false);
      } catch (error: any) {
        toast.error('Something went wrong.' + error);
      } finally {
        setLoading(false);
      }
    } else {
      form.setError('manifacturername', { message: 'Insert the name' });
    }

  }





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
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input disabled={loading} type="number" placeholder="Product name" {...field} />
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
                    <Input type="number" disabled={loading} placeholder="Product name" {...field} />
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
          <Separator />



























          <FormField
            control={form.control}
            name="manufacturerId"
            render={({ field }) => (
              <FormItem  >
                <FormLabel>Manufacturers</FormLabel>
                <div className="md:grid md:grid-cols-2 align-middle items-center gap-8">
                  <div>
                    <Select disabled={loading} onValueChange={(val) => { field.onChange(val.valueOf()); manufacturerImg() }} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {manufacturers.map((category) => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>


                    <FormMessage />
                  </div>
                  <div className="">

                    <Button type="button" variant={"outline"} onClick={openDialog}>Add manifacturer</Button>


                    <Dialog defaultOpen onOpenChange={() => closeDialog()} open={isDialogOpen}
                    >

                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader >

                          <DialogTitle>Manufacturers</DialogTitle>
                          <DialogDescription>
                            Click save when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>


                        <div className="grid gap-4 py-4">

                          <FormField
                            control={form.control}
                            name="manifacturername"
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


                        </div>


                        <DialogFooter className="sm:justify-end">

                          <Button onClick={closeDialog} type="button" variant="secondary">
                            save
                          </Button>

                        </DialogFooter>



                      </DialogContent>
                    </Dialog>

                    {manifacturerimgdrop ? <Button type="button" className="ml-3" variant="destructive" > <Trash className="mr-2 h-4 w-4" /> Delete</Button>
                      : <></>

                    }

                  </div>
                  {
                    manifacturerimgdrop ?
                      <ImageUpload

                        value={manifacturerimg}
                        onChange={(url) => { uploadImg(url) }}
                        onRemove={() => field.onChange('')}
                      /> : <></>
                  }

                </div>

              </FormItem>
            )}
          />

          <Separator />







          <div className="md:grid md:grid-cols-2 align-middle items-center gap-8">


              
<PopFormModal label={"Ram Slots"} 
              form1={form} 
              loading={loading} 
              setLoading={setLoading} 
              data={...ramslots}
              fieldaAfficher="number"
              url="/api/motherboard/RamSlots"
              formLab="ramslotsId"
              formCControlName="ramslots"
              IsNumber={true}
              />

         
<PopFormModal label={"Motherboard Chipset"} 
              form1={form} 
              loading={loading} 
              setLoading={setLoading} 
              data={...chipset}
              fieldaAfficher="name"
              url="/api/motherboard/MotherboardChipset"
              formLab="chipsetId"
              formCControlName="chipset"
              IsNumber={false}
              />
          
          <PopFormModal label={"CPU Support"} 
              form1={form} 
              loading={loading} 
              setLoading={setLoading} 
              data={...cpusupport}
              fieldaAfficher="name"
              url="/api/motherboard/CPUSupport"
              formLab="cpusupportId"
              formCControlName="cpusupport"
              IsNumber={false}
              />
          
          <PopFormModal label={"Motherboard format"} 
              form1={form} 
              loading={loading} 
              setLoading={setLoading} 
              data={...format}
              fieldaAfficher="name"
              url="/api/motherboard/motherboardFormat"
              formLab="formatId"
              formCControlName="motherboardFormat"
              IsNumber={false}
              />

       


        
</div>
          <Separator />





          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
