"use client"

import * as z from "zod"
const axios = require("axios");
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { CPUSupport, Category, ComponentOnPc, ComponentOnPcGroupeEntityProfile, EntityProfile, Image, PreBuiltPcmodel, pcTemplate } from "@prisma/client"
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

import { Product } from "@/types";

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
    discountOnPc:z.coerce.number().optional(),
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
    rams: Product[];
}
type DiskSlot = {
    disk: Product[];
}
type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
        PreBuiltPcmodel: {

            pcTemplate: pcTemplate & {
                caseId: EntityProfile[],
                processorId: EntityProfile[],
                cooling: EntityProfile[],
                graphicCardId: EntityProfile[],
                motherBoardId: EntityProfile[],
                powerSupplyId: EntityProfile[],
                ramIdArray: { Components: EntityProfile[], defaultId: string }[];
                hardDiskArray: { Components: EntityProfile[], defaultId: string }[],

            }
        } | null


    } | null;
    categories: Category[];

    motherboards: Product[];
    cpus: Product[];
    gpus: Product[];
    rams: Product[];
    diks: Product[];
    powersupplies: Product[]
    cases: Product[];
    motherboardData: motherboardata[]
    cpuData: motherboardata[]
    cooling: Product[],
};


const CustomPcTemplate : React.FC<ProductFormProps> = ({
    initialData,
    categories, 
    motherboards,
    cpus,
    gpus,
    rams,
    diks,
    powersupplies,
    cases,
    cooling,
  }) => {
    return (

        <div>CustomPcTemplate</div>
    )
}

export default CustomPcTemplate