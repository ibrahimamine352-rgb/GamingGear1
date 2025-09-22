"use client"

import * as z from "zod"
const axios = require("axios");
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Category, Image, Product, Manufacturer, RamSlots, MotherboardChipset, CPUSupport, Guarantee, MotherboardFormat, Motherboard } from "@prisma/client"
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
import { Textarea } from "@/components/ui/textarea";

const ramformSchema = z.object({
    name: z.string().min(1),
    type:z.string().min(1),
    number: z.coerce.number().min(1),
  });
  type RamProductFormValues = z.infer<typeof ramformSchema>

export const Ramform= () => {
    const form2 = useForm<RamProductFormValues>({
        resolver: zodResolver(ramformSchema)
      });

      const [isDialogOpen2, setIsDialogOpen2] = useState(false);
      const openDialog2 = () => {
        setIsDialogOpen2(true);
      };
    
      const [loading, setLoading] = useState(false);
      const router = useRouter();
  const submit1 = async () => {
    form2.trigger()
    const data =form2.getValues()
    console.log("d'ata")
    if (form2.formState.isValid) {
      try {
        setLoading(true);
        console.log(data)
        data.number=parseInt(data.number.toString())
        await axios.post(`/api/motherboard/RamSlots`, data);
      
        const toastMessage = 'Product created.';
      
        toast.success(toastMessage);
        router.refresh();
        setIsDialogOpen2(false);
      } catch (error: any) {
        toast.error('Something went wrong.');
        console.log(error)
      }finally{
        setLoading(false);
        setIsDialogOpen2(false);
        
      }
    } else {
      form2.trigger();

    }




  };
  return (
    <div>   <Button type="button" variant={"outline"} onClick={openDialog2}>Add Ram Slot</Button>


                    <Dialog defaultOpen onOpenChange={() => setIsDialogOpen2(!isDialogOpen2)} open={isDialogOpen2}
                    >

                      <DialogContent className="sm:max-w-[425px]">
                      <Form {...form2}>
                        <form  >
                        <DialogHeader >

                          <DialogTitle>Ram Slot</DialogTitle>
                          <DialogDescription>
                            Click save when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>


                        <div className="grid gap-4 py-4">
                       
                          
                                
                                 <FormField
                            control={form2.control}
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
                            control={form2.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>type</FormLabel>
                                <FormControl>
                                  <Input disabled={loading} placeholder="Product name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={form2.control}
                            name="number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>number</FormLabel>
                                <FormControl>
                                  <Input type="number" disabled={loading} placeholder="Product name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        
                                </div>
                            
                        



                        <DialogFooter className="sm:justify-end">

                          <Button disabled={loading} onClick={()=>submit1()} type="button" variant="secondary">
                            save
                          </Button>
  
                        </DialogFooter>
                        </form>
                        </Form>

                      </DialogContent>
                    </Dialog>


             
                 </div>
  )
}
