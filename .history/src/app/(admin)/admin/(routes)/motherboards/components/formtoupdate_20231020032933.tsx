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
     url:String
}

export const PopFormModal: React.FC<PopUpProps> = ({
  label,
  form1,
  loading,
  setLoading,
  data,
  url
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    ...form1,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isDialogOpenRam, setIsDialogOpenRam] = useState(false);

  const openDialog1 = () => {
    setIsDialogOpenRam(true);
  };

  const closeDialogRam = async () => {
 
  };
  return (
    <FormField
            control={form.control}
            name="chipsetId"
            render={({ field }) => (
              <FormItem  >
              <FormLabel>{label}</FormLabel>
              <div className="md:grid md:grid-cols-2 align-middle items-center gap-8">
                <div>
                  <Select disabled={loading} onValueChange={ field.onChange } value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder={'Select a '+label} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
          
          
                  <FormMessage />
                </div>
                <div className="">
          
                  <Button type="button" variant={"outline"} onClick={openDialog1}>Add {label}</Button>
          
          
                  <Dialog defaultOpen open={isDialogOpenRam}
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
                          name="ramslots"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input disabled={loading} type="number" {...field} />
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
