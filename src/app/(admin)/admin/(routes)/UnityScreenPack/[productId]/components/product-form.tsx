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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import InputArray from "./addtioanlinfos";
import Pctemplate from "./pc-template";
import { ProdCol } from "@/types";

/** ----- Types kept simple to avoid TS noise ----- */
type Field = { name: string; value: string };

type FullPackRow = {
  id: number;
  Unity: ProdCol[];
  Screen: ProdCol[];
  Pack: ProdCol[];
  DefaultPack: string;
  DefaultUnity: string;
  DefaultScreen: string;
  discountOnPack: number;
};

export type ProductFormProps = {
  /** Keep loose to avoid red squiggles from shape drift */
  initialData: any | null;
  categories: Category[];
  screens: ProdCol[];
  unities: ProdCol[];
  packs: ProdCol[];
};

/** ----- Zod form schema (unchanged) ----- */
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

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  // FullPack row 0 from initialData (if present)
  const fp0: FullPackRow | undefined = useMemo(
    () => initialData?.FullPack?.[0],
    [initialData]
  );

  /** ----- Default form values from initialData ----- */
  const defaultValues: ProductFormValues = {
    name: initialData?.name ?? "",
    images: initialData?.images ?? [],
    // Prisma Decimal-safe -> Number(...)
    price: Number(initialData?.price ?? 0),
    categoryId: initialData?.categoryId ?? "",
    dicountPrice: Number(initialData?.dicountPrice ?? 0),
    description: initialData?.description ?? "",
    stock: Number(initialData?.stock ?? 0),
    isFeatured: Boolean(initialData?.isFeatured),
    isArchived: Boolean(initialData?.isArchived),
    comingSoon: Boolean(initialData?.comingSoon),
    outOfStock: Boolean(initialData?.outOfStock),
    additionalDetails: (initialData?.additionalDetails ?? []).map((d: Field) => ({
      name: d.name,
      value: d.value,
    })),
    discountOnPc: Number(fp0?.discountOnPack ?? 0),
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  /** ----- Pickers state (Unity / Screen / Pack) ----- */
  const [screensList, setscreensList] = useState<ProdCol[]>(
    fp0?.Screen ? screens.filter((s) => fp0.Screen.some((x) => x.id === s.id)) : []
  );
  const [PackList, setPackList] = useState<ProdCol[]>(
    fp0?.Pack ? packs.filter((p) => fp0.Pack.some((x) => x.id === p.id)) : []
  );
  const [UnityList, setUnityList] = useState<ProdCol[]>(
    fp0?.Unity ? unities.filter((u) => fp0.Unity.some((x) => x.id === u.id)) : []
  );

  const [DefaultPack, setDefaultPack] = useState<string>(fp0?.DefaultPack ?? "");
  const [DefaultScreen, setDefaultScreen] = useState<string>(fp0?.DefaultScreen ?? "");
  const [DefaultUnity, setDefaultUnity] = useState<string>(fp0?.DefaultUnity ?? "");

  /** ----- Total calculator ----- */
  const [total, setTotal] = useState<number>(Number(initialData?.price ?? 0));
  const calcTotal = () => {
    let pr = 0;

    if (DefaultUnity) {
      const prod = UnityList.find((e) => e.id === DefaultUnity);
      if (prod) pr += prod.price;
    }
    if (DefaultScreen) {
      const prod = screensList.find((e) => e.id === DefaultScreen);
      if (prod) pr += prod.price;
    }
    if (DefaultPack) {
      const prod = PackList.find((e) => e.id === DefaultPack);
      if (prod) pr += prod.price;
    }

    const dis = form.getValues("discountOnPc") ?? 0;
    if (dis && dis > 0) pr -= dis;

    setTotal(pr);
  };

  useEffect(() => {
    calcTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.watch("discountOnPc"),
    DefaultPack,
    DefaultScreen,
    DefaultUnity,
    UnityList,
    PackList,
    screensList,
  ]);

  /** ----- Submit / Delete ----- */
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      if (total) data.price = Number(total);
      const dis = Number(form.getValues("discountOnPc") ?? 0);

      const payload = {
        ...data,
        prodid: initialData?.id, // undefined on create -> OK
        packid: fp0?.id, // undefined on create -> OK
        Unity: UnityList,
        Pack: PackList,
        discountOnPack: dis,
        DefaultScreen,
        DefaultPack,
        DefaultUnity,
      };

      // ✅ no useParams in client component; rely on initialData.id for edit
      const id = typeof initialData?.id === "string" ? initialData.id : undefined;

      if (id) {
        await axios.patch(`/api/Pack/${id}`, payload);
      } else {
        await axios.post(`/api/Pack`, payload);
      }

      router.refresh();
      router.push(`/admin/CustomPack`);
      toast.success(toastMessage);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      if (!initialData?.id) return;
      setLoading(true);
      await axios.delete(`/api/Pack/${initialData.id}`);
      router.refresh();
      router.push(`/products`);
      toast.success("Product deleted.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  /** ----- Render ----- */
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
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
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) =>
                      field.onChange(field.value.filter((current) => current.url !== url))
                    }
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
                    <Input disabled={loading} placeholder="Product name" {...field} />
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
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
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
                    <Textarea disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* hidden numeric fields (kept for compatibility) */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
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
                  <FormLabel>DicountPrice</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="" {...field} />
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
                    <Input type="number" disabled={loading} placeholder="" {...field} />
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
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>This product will appear on the home page</FormDescription>
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
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>This product will not appear anywhere in the store.</FormDescription>
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
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Coming Soon</FormLabel>
                    <FormDescription>Mark this product as coming soon</FormDescription>
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
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                    </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Out of Stock</FormLabel>
                    <FormDescription>Mark this product as out of stock</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Separator />

          {/* Sticky footer with total + discount */}
          <div className="w-full fixed bottom-0 left-0 z-40 bg-white dark:bg-black border-t-small py-3 px-3">
            <div>Total : {total.toString()} TND</div>
            <FormField
              control={form.control}
              name="discountOnPc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>discount On Pc</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      onKeyDown={(ke) => {
                        if (ke.key === "Enter") form.trigger();
                      }}
                      disabled={loading}
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} className="ml-auto my-3 w-full" type="submit">
              Product {action}
            </Button>
          </div>

          {/* Unity / Screen / Pack pickers */}
          <Pctemplate
            screens={screens}
            screensList={screensList}
            setDefaultScreen={setDefaultScreen}
            setscreensList={setscreensList}
            initialData={initialData}
            DefaultUnity={DefaultUnity}
            DefaultPack={DefaultPack}
            DefaultScreen={DefaultScreen}
            setDefaultUnity={setDefaultUnity}
            setDefaultPack={setDefaultPack}
            UnityList={UnityList}
            PackList={PackList}
            setUnityList={setUnityList}
            setPackList={setPackList}
            unities={unities}
            packs={packs}
          />
        </form>
      </Form>

      {/* Spacer for the fixed footer */}
      <div className="h-40" />
    </>
  );
};

export default ProductForm;
