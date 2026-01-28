"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Category } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";
import InputArray from "./addtioanlinfos";
import { ProdCol } from "@/types";

/** MUST match Prisma enum */
type PackType = "CUSTOM";

/* ---------------- DTO TYPES (plain JS types only) ---------------- */
export type PackForForm = {
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
};

export type ProductForForm = {
  id: string;
  name: string;
  categoryId: string;
  description: string;

  images: { url: string }[];

  price: number;
  dicountPrice: number;
  stock: number;

  isFeatured: boolean;
  isArchived: boolean;
  comingSoon: boolean;
  outOfStock: boolean;

  additionalDetails: { name: string; value: string }[];

  PackProduct: PackForForm[];
};

/* ---------------- ZOD ---------------- */
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
  additionalDetails: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export interface ProductFormProps {
  initialData: ProductForForm | null;

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
}) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const pack0 = initialData?.PackProduct?.[0];

  const defaultValues: ProductFormValues = useMemo(() => {
    if (!initialData) {
      return {
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
      };
    }

    return {
      name: initialData.name ?? "",
      images: initialData.images ?? [],
      price: Number(initialData.price ?? 0),
      categoryId: initialData.categoryId ?? "",
      dicountPrice: Number(initialData.dicountPrice ?? 0),
      description: initialData.description ?? "",
      stock: Number(initialData.stock ?? 0),
      isFeatured: Boolean(initialData.isFeatured),
      isArchived: Boolean(initialData.isArchived),
      comingSoon: Boolean(initialData.comingSoon),
      outOfStock: Boolean(initialData.outOfStock),
      discountOnPc: Number(pack0?.discountOnPack ?? 0),
      additionalDetails: (initialData.additionalDetails ?? []).map((d) => ({
        name: d.name,
        value: d.value,
      })),
    };
  }, [initialData, pack0?.discountOnPack]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [total, setTotal] = useState<number>(Number(initialData?.price ?? 0));

  // If you compute total somewhere else, keep it.
  // Here we just sync it with discountOnPc for demo.
  useEffect(() => {
    const dis = Number(form.getValues("discountOnPc") ?? 0);
    const base = Number(initialData?.price ?? 0);
    setTotal(Math.max(0, base - dis));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("discountOnPc")]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        packType: "CUSTOM" as PackType,
        price: Number(total),
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
      console.error(e);
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
        onConfirm={() => setOpen(false)}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading
          title={initialData ? "Edit Custom Pack" : "Create Custom Pack"}
          description="Manage custom accessory packs"
        />

        {initialData?.id && (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={(field.value ?? []).map((i) => i.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...(field.value ?? []), { url }])}
                    onRemove={(url) =>
                      field.onChange((field.value ?? []).filter((i) => i.url !== url))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* optional display */}
          <div className="text-sm">Total: {total} TND</div>

          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details</FormLabel>
                <FormControl>
                  <InputArray
                    inputArrayp={field.value ?? []}
                    onChange={(v: any) => field.onChange(v)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
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
