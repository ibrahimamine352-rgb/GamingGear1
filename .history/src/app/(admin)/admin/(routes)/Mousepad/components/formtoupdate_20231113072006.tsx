"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Control, FormProps, UseFormGetValues, UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import  { useRouter } from "next/navigation";
import { apiBaseUrl } from "next-auth/client/_utils";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  mousepadModelId:z.string().min(1),
  mousepadSizeId:z.string().min(1),
  rgb: z.boolean().default(false).optional(),
  manufacturerId:z.string().min(1),
  dicountPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(1),
  description:z.string().min(1),
  manifacturername: z.string().optional(),
  additionalDetails : z.object({ name: z.string(),value:z.string() }).array()

});
type ProductFormValues = z.infer<typeof formSchema>

interface PopUpProps {
     label:String;
     form1 :  UseFormReturn<ProductFormValues>;
     loading:boolean
     setLoading: (value: boolean) => void;
     data:any[]
     url:string
     formLab:String
     formCControlName:String
     fieldaAfficher:String
     IsNumber?:boolean
}

export const PopFormModal: React.FC<PopUpProps> = ({
  label,
  form1,
  loading,
  setLoading,
  data,
  url,
  formLab,
  formCControlName,
  fieldaAfficher,
  IsNumber
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);


  const form =form1

  useEffect(() => {
    setIsMounted(true);
  }, []);

 
  const openDialog = () => {
    setIsDialogOpen(true);
    console.log(data)
  };
  const toastMessage ="created"
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const closeDialogRam = async () => {
  
    const values = form.getValues();
    
    const fieldValue = values[formCControlName as keyof typeof values];
    console.log(fieldValue)
    if (fieldValue) {
      // Do something with fieldValue

      try {
        const values = form.getValues();
        const name = values[formCControlName as keyof typeof values];
    
        setLoading(true);
        if(label=="Ram Slots" && name){
          let val = parseInt(name as string); // Convert to number
          if (!isNaN(val)) {
            // Check if the conversion was successful
            await axios.post(url, { number: val });
          } else {
            // Handle the case where 'name' cannot be converted to a valid number
            console.error("Invalid number:", name);
          }
        }else{
          await axios.post(url, { name});
  
        }
       
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
      form.setError(formCControlName as keyof typeof values, { message: 'Insert the '+fieldaAfficher });
      setLoading(false);
   
      // Handle the case where fieldName is not in the form values
    }

 
  
 
  };
  return (
    <FormField
            control={form.control}
            name={formLab as keyof  ProductFormValues }
            render={({ field }) => (
              <FormItem  >
              <FormLabel>{label}</FormLabel>
              <div className="md:grid md:grid-cols-2 align-top items-center gap-8">
                <div>
                  <Select disabled={loading} onValueChange={ field.onChange } value={field.value ? String(field.value) : ''} defaultValue={field.value ? String(field.value) : ''}>
                    <FormControl>
                      <SelectTrigger>
                      <SelectValue defaultValue={field.value ? String(field.value) : ''} placeholder={'Select a ' + label} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data.map((category) => (
                     <SelectItem key={category.id} value={category.id}>
                     {category[fieldaAfficher as keyof typeof category.TypeOf]}
                   </SelectItem>    ))}
                    </SelectContent>
                  </Select>
          
          
                  <FormMessage />
                </div>
                <div className="w-full">
          
                  <Button type="button" className="w-full" variant={"outline"} onClick={openDialog}>Add {label}</Button>
          
          
                  <Dialog  open={isDialogOpen} onOpenChange={()=>setIsDialogOpen(!isDialogOpen)}
                  >
          
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader >
          
                        <DialogTitle>{label}</DialogTitle>
                        <DialogDescription>
                          Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
          
          
                      <div className="grid gap-4 py-4">
          
                        <FormField
                          control={form.control}
                          name={formCControlName as keyof  ProductFormValues }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                              {
  IsNumber ? (
    <Input
      disabled={loading}
      type="number"
      value={field.value ? String(field.value) : ''}
      onChange={field.onChange}
    />
  ) : (
    <Input
      disabled={loading}
      type="text"
      value={field.value ? String(field.value) : ''}
      onChange={field.onChange}
    />
  )
}

                              
                            
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
          
          
                      </div>
          
          
                      <DialogFooter className="sm:justify-end">
          
                        <Button onClick={closeDialogRam} type="button" variant="secondary">
                          save
                        </Button>
          
                      </DialogFooter>
          
          
          
                    </DialogContent>
                  </Dialog>
          
                
          
                </div>
              </div>
          
            </FormItem>
                )}
          />
   
  );
};
