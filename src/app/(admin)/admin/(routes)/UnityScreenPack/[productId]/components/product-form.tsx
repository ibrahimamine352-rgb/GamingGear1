"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";

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

import Pctemplate from "./pc-template";
import { ProdCol } from "@/types";

/** ✅ MUST match your Prisma enum exactly */
type PackType = "CUSTOM" | "UNITY_SCREEN";

type FieldKV = { name: string; value: string };

type FullPackRow = {
  id: string; // Prisma uuid
  Unity: ProdCol[];
  Screen: ProdCol[];
  Pack: ProdCol[]; // (your UI list type)
  DefaultPack: string;
  DefaultUnity: string;
  DefaultScreen: string;
  discountOnPack: number;
};

export type ProductFormProps = {
  initialData: any | null;
  categories: Category[];
  screens: ProdCol[];
  unities: ProdCol[];
  packs: ProdCol[];
};

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array().min(1),
  price: z.coerce.number().min(0).optional(),
  categoryId: z.string().min(1),
  dicountPrice: z.coerce.number().optional(),
  description: z.string().min(1),
  discountOnPc: z.coerce.number().optional(),
  stock: z.coerce.number().min(0).optional(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  comingSoon: z.boolean().default(false).optional(),
  outOfStock: z.boolean().default(false).optional(),
  additionalDetails: z.object({ name: z.string(), value: z.string() }).array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  screens,
  unities,
  packs,
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Unity+Screen Pack" : "Create Unity+Screen Pack";
  const descriptionText = initialData ? "Edit this pack." : "Create a new Unity+Screen pack.";
  const toastMessage = initialData ? "Pack updated." : "Pack created.";
  const actionLabel = initialData ? "Save changes" : "Create";

  const fp0: FullPackRow | undefined = useMemo(
    () => initialData?.FullPack?.[0],
    [initialData]
  );

  const defaultValues: ProductFormValues = {
    name: initialData?.name ?? "",
    images: initialData?.images ?? [],
    price: Number(initialData?.price ?? 0),
    categoryId: initialData?.categoryId ?? "",
    dicountPrice: Number(initialData?.dicountPrice ?? 0),
    description: initialData?.description ?? "",
    stock: Number(initialData?.stock ?? 0),
    isFeatured: Boolean(initialData?.isFeatured),
    isArchived: Boolean(initialData?.isArchived),
    comingSoon: Boolean(initialData?.comingSoon),
    outOfStock: Boolean(initialData?.outOfStock),
    additionalDetails: (initialData?.additionalDetails ?? []).map((d: FieldKV) => ({
      name: d.name,
      value: d.value,
    })),
    discountOnPc: Number(fp0?.discountOnPack ?? 0),
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const discountOnPc = Number(form.watch("discountOnPc") ?? 0);

  /** Pickers state */
  const [screensList, setScreensList] = useState<ProdCol[]>(
    fp0?.Screen ? screens.filter((s) => fp0.Screen.some((x) => x.id === s.id)) : []
  );
  const [packList, setPackList] = useState<ProdCol[]>(
    fp0?.Pack ? packs.filter((p) => fp0.Pack.some((x) => x.id === p.id)) : []
  );
  const [unityList, setUnityList] = useState<ProdCol[]>(
    fp0?.Unity ? unities.filter((u) => fp0.Unity.some((x) => x.id === u.id)) : []
  );

  const [defaultPack, setDefaultPack] = useState<string>(fp0?.DefaultPack ?? "");
  const [defaultScreen, setDefaultScreen] = useState<string>(fp0?.DefaultScreen ?? "");
  const [defaultUnity, setDefaultUnity] = useState<string>(fp0?.DefaultUnity ?? "");

  /** Total */
  const [total, setTotal] = useState<number>(Number(initialData?.price ?? 0));

  const calcTotal = () => {
    let pr = 0;

    if (defaultUnity) {
      const prod = unityList.find((e) => e.id === defaultUnity);
      if (prod) pr += Number(prod.price ?? 0);
    }
    if (defaultScreen) {
      const prod = screensList.find((e) => e.id === defaultScreen);
      if (prod) pr += Number(prod.price ?? 0);
    }
    if (defaultPack) {
      const prod = packList.find((e) => e.id === defaultPack);
      if (prod) pr += Number(prod.price ?? 0);
    }

    if (discountOnPc > 0) pr -= discountOnPc;

    setTotal(pr);
  };

  useEffect(() => {
    calcTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountOnPc, defaultPack, defaultScreen, defaultUnity, unityList, packList, screensList]);

  /** Submit */
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      const packType: PackType = "UNITY_SCREEN"; // ✅ matches Prisma enum
      const payload = {
        ...data,
        packType,
        price: Number(total),

        prodid: initialData?.id,
        packid: fp0?.id,

        Unity: unityList,
        Screen: screensList,
        Pack: packList,

        discountOnPack: Number(discountOnPc ?? 0),
        DefaultUnity: defaultUnity,
        DefaultScreen: defaultScreen,
        DefaultPack: defaultPack,
      };

      const id = typeof initialData?.id === "string" ? initialData.id : undefined;

      if (id) {
        await axios.patch(`/api/Pack/${id}`, payload);
      } else {
        await axios.post(`/api/Pack`, payload);
      }

      router.refresh();
      router.push(`/admin/UnityScreenPack`);
      toast.success(toastMessage);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /** Delete */
  const onDelete = async () => {
    try {
      if (!initialData?.id) return;
      setLoading(true);

      await axios.delete(`/api/Pack/${initialData.id}`);

      router.refresh();
      router.push(`/admin/UnityScreenPack`);
      toast.success("Pack deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

      <div className="flex items-center justify-between">
        <Heading title={title} description={descriptionText} />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={(field.value ?? []).map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...(field.value ?? []), { url }])}
                    onRemove={(url) => field.onChange((field.value ?? []).filter((cur) => cur.url !== url))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Pack name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="Describe this pack..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Keep hidden fields (schema requires them) */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dicountPrice"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>DiscountPrice</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={!!field.value} /* @ts-ignore */ onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>Show on home page</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={!!field.value} /* @ts-ignore */ onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>Hide from store</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comingSoon"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={!!field.value} /* @ts-ignore */ onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Coming Soon</FormLabel>
                    <FormDescription>Mark as coming soon</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="outOfStock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={!!field.value} /* @ts-ignore */ onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Out of Stock</FormLabel>
                    <FormDescription>Mark as out of stock</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Footer */}
          <div className="w-full fixed bottom-0 left-0 z-40 bg-white dark:bg-black border-t py-3 px-3">
            <div className="mb-2 font-medium">Total: {Number(total).toString()} TND</div>

            <FormField
              control={form.control}
              name="discountOnPc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} className="ml-auto my-3 w-full" type="submit">
              {actionLabel}
            </Button>
          </div>

          {/* Pickers */}
          <Pctemplate
            screens={screens}
            screensList={screensList}
            setDefaultScreen={setDefaultScreen}
            setscreensList={setScreensList}
            initialData={initialData}
            DefaultUnity={defaultUnity}
            DefaultPack={defaultPack}
            DefaultScreen={defaultScreen}
            setDefaultUnity={setDefaultUnity}
            setDefaultPack={setDefaultPack}
            UnityList={unityList}
            PackList={packList}
            setUnityList={setUnityList}
            setPackList={setPackList}
            unities={unities}
            packs={packs}
          />
        </form>
      </Form>

      <div className="h-40" />
    </>
  );
};

export default ProductForm;
