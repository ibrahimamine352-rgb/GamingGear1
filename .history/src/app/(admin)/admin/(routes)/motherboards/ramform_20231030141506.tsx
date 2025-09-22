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

export const ramform = () => {
    const form2 = useForm<RamProductFormValues>({
        resolver: zodResolver(ramformSchema)
      });

      
  const submit1 = async (data:RamProductFormValues) => {
    console.log("d'ata")
    if (!form2.formState.dirtyFields) {
      try {
        setLoading(true);
        console.log(data)
        await axios.post(`/api/motherboard/ramslots`, data);

        toast.success(toastMessage);
        router.refresh();
        setIsDialogOpen2(false);
      } catch (error: any) {
        toast.error('Something went wrong.');
        setIsDialogOpen2(false);
      } finally {
        setLoading(false);
        setIsDialogOpen2(false);
        toast.error('Something went wrong.');
      }
    } else {
      form2.trigger();

    }




  };
  return (
    <div>ramform</div>
  )
}
