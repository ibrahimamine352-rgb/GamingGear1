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
  manufacturerId: z.string().min(1),
  ramslotsId: z.string().min(1),
  chipsetId: z.string().min(1),
  cpusupportId: z.string().min(1),
  guaranteeId: z.string().min(1),
  formatId: z.string().min(1),
  manifacturername: z.string().optional(),
  ramslots: z.number().optional()
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
  fieldaAfficher
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    ...form1,
  });

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
    console.log(formLab)
    const fieldValue = values[formLab as keyof typeof values];
    
    if (fieldValue) {
      // Do something with fieldValue

      try {
        const values = form.getValues();
        const name = values[formCControlName as keyof typeof values];
    
        setLoading(true);
  
        await axios.post(url, { name});
  
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
              <div className="md:grid md:grid-cols-2 align-middle items-center gap-8">
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
                <div className="">
          
                  <Button type="button" variant={"outline"} onClick={openDialog}>Add {label}</Button>
          
          
                  <Dialog defaultOpen open={isDialogOpen}
                  >
          
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader >
          
                        <DialogTitle>{label}</DialogTitle>
                        <DialogDescription>
                          Click save when you're done.
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
                              <Input disabled={loading} type="text" value={field.value ? String(field.value) : ''} onChange={field.onChange} />

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
