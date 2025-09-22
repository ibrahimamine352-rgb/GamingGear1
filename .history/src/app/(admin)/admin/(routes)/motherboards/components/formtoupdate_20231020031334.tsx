"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
     form1 : ProductFormValues;
     loading:boolean
     setLoading: (value: boolean) => void;
     data:any[]
}

export const PopFormModal: React.FC<PopUpProps> = ({

  label,
  form1,
  loading,
  setLoading
  data
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    ...form1
  });
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }


  

  const [isDialogOpenRam, setIsDialogOpenRam] = useState(false);


  const openDialog1 = () => {
    setIsDialogOpenRam(true);
  };

  const closeDialogRam = async () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) {
      return null;
    }
  
    const [isDialogOpenRam, setIsDialogOpenRam] = useState(false);
  
    const openDialog1 = () => {
      setIsDialogOpenRam(true);
    };
  
  
  return (
   
    <FormItem  >
    <FormLabel>MotherboardChipset</FormLabel>
    <div className="md:grid md:grid-cols-2 align-middle items-center gap-8">
      <div>
        <Select disabled={loading} onValueChange={ field.onChange } value={field.value} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue defaultValue={field.value} placeholder="Select a category" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {ramslots.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.number}</SelectItem>
            ))}
          </SelectContent>
        </Select>


        <FormMessage />
      </div>
      <div className="">

        <Button type="button" variant={"outline"} onClick={openDialog1}>Add Ram Slots</Button>


        <Dialog defaultOpen open={isDialogOpenRam}
        >

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader >

              <DialogTitle>Ram Slots</DialogTitle>
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

        {manifacturerimgdrop ? <Button type="button" className="ml-3" variant="destructive" > <Trash className="mr-2 h-4 w-4" /> Delete</Button>
          : <></>

        }

      </div>
    </div>

  </FormItem>
  );
};
