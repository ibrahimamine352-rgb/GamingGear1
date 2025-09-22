"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import ImageUpload from "@/components/ui/image-upload"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slide } from "@prisma/client"
import { ColorPicker, useColor } from "react-color-palette"; 
import "react-color-palette/dist/css/rcp.css"; 
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
const formSchema = z.object({

  title:  z.string(),
  imageUrl: z.string(),
  description:  z.string(),
  url:  z.string(),
  bgUrl:  z.string(),
  mobilebgURl:  z.string(),
  titleColor: z.string().optional(),
  descriptionColor: z.string().optional(),
  discount: z.number().refine((value) => value >= 0, {
    message: "Discount must be at least 0",
  }).optional(),
});

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Slide | null;
};

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Slide' : 'Create Slide';
  const description = initialData ? 'Edit a billboard.' : 'Add a new Slide';
  const toastMessage = initialData ? 'Slide updated.' : 'Slide created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '', 
      imageUrl: '', 
      description: '', 
      url:'', 
      bgUrl:"",
      mobilebgURl:"",
      titleColor:'',
      descriptionColor:''
    }
  });
  const [color, setColor] = useColor(form.getValues('titleColor')||''); 
  const [colorDesc, setColorDesc] = useColor(form.getValues('descriptionColor')||''); 
  const onSubmit = async (data: BillboardFormValues) => {
    form.setValue("titleColor",color.hex)
    form.setValue("descriptionColor",colorDesc.hex)
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/Slide/${params.billboardId}`, data);
      } else {
        await axios.post(`/api/Slide`, data);
      }
      router.refresh();
      router.push(`/admin/mainpage`);
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
      await axios.delete(`/api/Slide/${params.billboardId}`);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success('Billboard deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this billboard first.');
    } finally {
      setLoading(false);
      setOpen(false);
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
          <div className="grid grid-cols-3 gap-4">
          <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slider Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []} 
                      disabled={loading} 
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="bgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []} 
                      disabled={loading} 
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="mobilebgURl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile background image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []} 
                      disabled={loading} 
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
       
          <div className="md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><div className="flex">
                  <Input disabled={loading} placeholder="Slide title" {...field} />
                  </div>
                  
                    
                  </FormControl>
                  <FormMessage />

                </FormItem>
              )}
            /> 
             <div style={{'color':color.hex??''}} className={`text-[${color.hex}] font-bold ml-2`}>{form.getValues('title')} </div>
                 
            <Drawer>
  <DrawerTrigger className="w-auto" ><br /><Button type="button" className="w-auto">Color Picker</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Pick the tite color: <div style={{'color':color.hex??''}} className={`text-[${color.hex}] `}>{form.getValues('title')} </div> </DrawerTitle>
    </DrawerHeader>
    <ColorPicker  height={228} color={color}  
    
    
                   onChange={(v)=>{setColor(v);
                    form.setValue("titleColor",v.hex)
                   
                   }}  /> 
    <DrawerFooter>
    <Button className="w-auto" onClick={()=>{setColor({...color,hex:'',hsv:{a:1,h:0,s:0,v:0},rgb:{a:1,b:0,g:0,r:0}})
    form.setValue("titleColor",'')
  }}>Remove Color</Button>
     
      <DrawerClose>
        <Button >Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

          </div>
          
          <div className="">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="flex">
                       <Textarea disabled={loading} placeholder="Slide Description" {...field} />
                      
                    </div>
                   
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> <div style={{'color':colorDesc.hex??''}} className={`text-[${colorDesc.hex}] font-bold ml-2`}>{form.getValues('description')} </div>
                 
              <Drawer>
  <DrawerTrigger className="w-auto" ><Button type="button" className="w-auto">Color Picker</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Pick the description color: <div style={{'color':colorDesc.hex??''}} className={`text-[${colorDesc.hex}]`}>{form.getValues('description')} </div> </DrawerTitle>
    </DrawerHeader>
    <ColorPicker  height={228} color={colorDesc}  
    
                   onChange={(v)=>{setColorDesc(v)
            
                    form.setValue("descriptionColor",v.hex)}}  /> 
    <DrawerFooter>
    <Button className="w-auto" onClick={()=>{setColorDesc({...colorDesc,hex:'',hsv:{a:1,h:0,s:0,v:0},rgb:{a:1,b:0,g:0,r:0}})
   form.setValue("descriptionColor",'')
  }}>Remove Color</Button>
      <DrawerClose>
        <Button >Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Slide URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <div className="flex items-center">
                  <Label className="mr-3">-</Label> 
                  <FormControl>
                
                    <Input disabled={loading} placeholder="Slide Discount" type="number"  />
           
                   
                  </FormControl> <Label className="ml-3">%</Label>         </div>
                 
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
