"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Category, Image, Product, Field } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import InputArray from "./addtioanlinfos";
import { ProdCol } from "@/types";
import Pctemplate from "./pc-template";

/** MUST match Prisma enum */
type PackType = "CUSTOM";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array().min(1),
  price: z.coerce.number().optional(),
  categoryId: z.string().min(1),
  dicountPrice: z.coerce.number().optional(),
  description: z.string().min(1),
  discountOnPc: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  comingSoon: z.boolean().optional(),
  outOfStock: z.boolean().optional(),
  additionalDetails: z.object({
    name: z.string(),
    value: z.string(),
  }).array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        additionalDetails: Field[];
        PackProduct: {
          id: string;
          Clavier: ProdCol[];
          Mouse: ProdCol[];
          MousePad: ProdCol[];
          Mic: ProdCol[];
          Headset: ProdCol[];
          Camera: ProdCol[];
          Screen: ProdCol[];
          Speaker: ProdCol[];
          Manette: ProdCol[];
          Chair: ProdCol[];
          DefaultClavier: string;
          DefaultMouse: string;
          DefaultMousePad: string;
          DefaultMic: string;
          DefaultHeadset: string;
          DefaultCamera: string;
          DefaultScreen: string;
          DefaultSpeaker: string;
          DefaultManette: string;
          DefaultChair: string;
          discountOnPack: number;
        }[];
      })
    | null;

  categories: Category[];
  keyboards: ProdCol[];
  Mouses: ProdCol[];
  Mousepads: ProdCol[];
  Mics: ProdCol[];
  Headsets: ProdCol[];
  Cameras: ProdCol[];
  screens: ProdCol[];
  Hautparleurs: ProdCol[];
  Manettes: ProdCol[];
  Chaisegamings: ProdCol[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  keyboards,
  Mouses,
  Mousepads,
  Mics,
  Headsets,
  Cameras,
  screens,
  Hautparleurs,
  Manettes,
  Chaisegamings,
}) => {
  const router = useRouter();
  const params = useParams();
  const pack0 = initialData?.PackProduct?.[0];

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          images: initialData.images,
          price: Number(initialData.price),
          categoryId: initialData.categoryId,
          dicountPrice: Number(initialData.dicountPrice),
          description: initialData.description,
          stock: Number(initialData.stock),
          isFeatured: initialData.isFeatured,
          isArchived: initialData.isArchived,
          comingSoon: initialData.comingSoon,
          outOfStock: initialData.outOfStock,
          discountOnPc: pack0?.discountOnPack ?? 0,
          additionalDetails: initialData.additionalDetails.map((d) => ({
            name: d.name,
            value: d.value,
          })),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          dicountPrice: 0,
          description: "",
          stock: 0,
          isFeatured: false,
          isArchived: false,
          comingSoon: false,
          outOfStock: false,
          discountOnPc: 0,
          additionalDetails: [],
        },
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(Number(initialData?.price ?? 0));

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        packType: "CUSTOM" as PackType,
        price: total,
      };

      if (initialData?.id) {
        await axios.patch(`/api/Pack/${initialData.id}`, payload);
      } else {
        await axios.post(`/api/Pack`, payload);
      }

      router.refresh();
      router.push("/admin/CustomPack");
      toast.success("Saved successfully");
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {}}
        loading={loading}
      />

      <Heading
        title={initialData ? "Edit Custom Pack" : "Create Custom Pack"}
        description="Manage custom accessory packs"
      />

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <ImageUpload
                value={field.value.map((i) => i.url)}
                onChange={(url) =>
                  field.onChange([...field.value, { url }])
                }
                onRemove={(url) =>
                  field.onChange(
                    field.value.filter((i) => i.url !== url)
                  )
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <InputArray
                inputArrayp={field.value}
                onChange={(v) => field.onChange(v)}
              />
            )}
          />

          <Button disabled={loading} type="submit" className="w-full">
            Save Pack
          </Button>
        </form>
      </Form>
    </>
  );
};
