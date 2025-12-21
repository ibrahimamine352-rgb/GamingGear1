"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Category, Image, Product } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import InputArray from "./addtioanlinfos";
import { ProdCol } from "@/types";
import Pctemplate from "./pc-template";

/** ✅ MUST match Prisma enum PackType */
type PackType = "CUSTOM" | "UNITY_SCREEN";

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

export interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        PackProduct: {
          id: string; // ✅ in Prisma AccessoryPack id is String(uuid)
          Clavier: ProdCol[];
          Headset: ProdCol[];
          Mic: ProdCol[];
          Mouse: ProdCol[];
          MousePad: ProdCol[];
          Screen: ProdCol[];
          Speaker: ProdCol[];
          Manette: ProdCol[];
          Chair: ProdCol[];
          Camera: ProdCol[];
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
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Custom Pack" : "Create Custom Pack";
  const description = initialData ? "Edit a pack." : "Add a new pack";
  const toastMessage = initialData ? "Pack updated." : "Pack created.";
  const action = initialData ? "Save changes" : "Create";

  const pack0 = initialData?.PackProduct?.[0];

  const defaultValues: ProductFormValues = initialData
    ? {
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
        additionalDetails: (initialData.additionalDetails ?? []).map((d: any) => ({
          name: d.name,
          value: d.value,
        })),
        discountOnPc: Number(pack0?.discountOnPack ?? 0),
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
        additionalDetails: [],
        discountOnPc: 0,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  /** picker lists (selected products) */
  const [keyboardList, setkeyboardList] = useState<ProdCol[]>(
    pack0?.Clavier ? keyboards.filter((e) => pack0.Clavier.some((ee) => e.id === ee.id)) : []
  );
  const [MouseList, setMouseList] = useState<ProdCol[]>(
    pack0?.Mouse ? Mouses.filter((e) => pack0.Mouse.some((ee) => e.id === ee.id)) : []
  );
  const [MousepadsList, setMousepadsList] = useState<ProdCol[]>(
    pack0?.MousePad ? Mousepads.filter((e) => pack0.MousePad.some((ee) => e.id === ee.id)) : []
  );
  const [MicsList, setMicsList] = useState<ProdCol[]>(
    pack0?.Mic ? Mics.filter((e) => pack0.Mic.some((ee) => e.id === ee.id)) : []
  );
  const [HeadsetsList, setHeadsetsList] = useState<ProdCol[]>(
    pack0?.Headset ? Headsets.filter((e) => pack0.Headset.some((ee) => e.id === ee.id)) : []
  );
  const [CamerasList, setCamerasList] = useState<ProdCol[]>(
    pack0?.Camera ? Cameras.filter((e) => pack0.Camera.some((ee) => e.id === ee.id)) : []
  );
  const [screensList, setscreensList] = useState<ProdCol[]>(
    pack0?.Screen ? screens.filter((e) => pack0.Screen.some((ee) => e.id === ee.id)) : []
  );
  const [HautparleursList, setHautparleursList] = useState<ProdCol[]>(
    pack0?.Speaker ? Hautparleurs.filter((e) => pack0.Speaker.some((ee) => e.id === ee.id)) : []
  );
  const [ManettesList, setManettesList] = useState<ProdCol[]>(
    pack0?.Manette ? Manettes.filter((e) => pack0.Manette.some((ee) => e.id === ee.id)) : []
  );
  const [ChaisegamingsList, setChaisegamingsList] = useState<ProdCol[]>(
    pack0?.Chair ? Chaisegamings.filter((e) => pack0.Chair.some((ee) => e.id === ee.id)) : []
  );

  /** defaults (picked as "DefaultX") */
  const [defaultKeyboard, setDefaultKeyboard] = useState<string>(pack0?.DefaultClavier ?? "");
  const [defaultMouse, setDefaultMouse] = useState<string>(pack0?.DefaultMouse ?? "");
  const [defaultMousePad, setDefaultMousePad] = useState<string>(pack0?.DefaultMousePad ?? "");
  const [defaultMics, setDefaultMics] = useState<string>(pack0?.DefaultMic ?? "");
  const [defaultHeadset, setDefaultHeadset] = useState<string>(pack0?.DefaultHeadset ?? "");
  const [defaultCamera, setDefaultCamera] = useState<string>(pack0?.DefaultCamera ?? "");
  const [defaultScreen, setDefaultScreen] = useState<string>(pack0?.DefaultScreen ?? "");
  const [DefaultSpeaker, setDefaultSpeaker] = useState<string>(pack0?.DefaultSpeaker ?? "");
  const [DefaultManette, setDefaultManette] = useState<string>(pack0?.DefaultManette ?? "");
  const [DefaultChair, setDefaultChair] = useState<string>(pack0?.DefaultChair ?? "");

  /** Total */
  const [total, setTotal] = useState<number>(Number(initialData?.price ?? 0));

  const calcTotal = () => {
    let pr = 0;

    const add = (list: ProdCol[], id: string) => {
      if (!id) return;
      const prod = list.find((e) => e.id === id);
      if (prod) pr += Number(prod.price ?? 0);
    };

    add(keyboardList, defaultKeyboard);
    add(MouseList, defaultMouse);
    add(MousepadsList, defaultMousePad);
    add(MicsList, defaultMics);
    add(HeadsetsList, defaultHeadset);
    add(CamerasList, defaultCamera);
    add(screensList, defaultScreen);
    add(HautparleursList, DefaultSpeaker);
    add(ManettesList, DefaultManette);
    add(ChaisegamingsList, DefaultChair); // ✅ FIXED (you had ManettesList here)

    const dis = Number(form.getValues("discountOnPc") ?? 0);
    if (dis > 0) pr -= dis;

    setTotal(pr);
  };

  useEffect(() => {
    calcTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.watch("discountOnPc"),
    DefaultChair,
    DefaultManette,
    DefaultSpeaker,
    defaultCamera,
    defaultHeadset,
    defaultKeyboard,
    defaultMics,
    defaultMouse,
    defaultMousePad,
    defaultScreen,
    keyboardList,
    MouseList,
    MousepadsList,
    MicsList,
    HeadsetsList,
    CamerasList,
    screensList,
    HautparleursList,
    ManettesList,
    ChaisegamingsList,
  ]);

  /** Submit */
  const onSubmit = async (data: ProductFormValues) => {
    const discountOnPack = Number(form.getValues("discountOnPc") ?? 0);

    try {
      setLoading(true);

      // ✅ force correct pack type for this form
      const packType: PackType = "CUSTOM";

      const payload = {
        ...data,
        packType, // ✅ REQUIRED by your API now
        price: Number(total),

        prodid: initialData?.id,
        packid: pack0?.id,

        Clavier: keyboardList,
        Mouse: MouseList,
        MousePad: MousepadsList,
        Mic: MicsList,
        Headset: HeadsetsList,
        Camera: CamerasList,
        Screen: screensList,
        Speaker: HautparleursList,
        Manette: ManettesList,
        Chair: ChaisegamingsList,

        discountOnPack,

        DefaultClavier: defaultKeyboard,
        DefaultMouse: defaultMouse,
        DefaultMousePad: defaultMousePad,
        DefaultMic: defaultMics,
        DefaultHeadset: defaultHeadset,
        DefaultCamera: defaultCamera,
        DefaultScreen: defaultScreen,
        DefaultSpeaker: DefaultSpeaker,
        DefaultManette: DefaultManette,
        DefaultChair: DefaultChair,
      };

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

  /** Delete */
  const onDelete = async () => {
    try {
      if (!initialData?.id) return;
      setLoading(true);

      await axios.delete(`/api/Pack/${initialData.id}`);

      router.refresh();
      router.push(`/admin/CustomPack`);
      toast.success("Product deleted.");
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
        <Heading title={title} description={description} />
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
                    <Textarea disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* hidden fields */}
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
                  <FormLabel>DicountPrice</FormLabel>
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
                    <FormDescription>This product will appear on the home page</FormDescription>
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
                    <FormDescription>Mark this product as coming soon</FormDescription>
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
                    <FormDescription>This product will not appear anywhere in the store.</FormDescription>
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
                    <FormDescription>Mark this product as out of stock</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Infos</FormLabel>
                <FormControl>
                  <InputArray
                    onChange={(arr: any[]) => field.onChange([...arr])}
                    inputArrayp={(field.value ?? []).map((i) => ({ name: i.name, value: i.value }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* footer */}
          <div className="w-full fixed bottom-0 left-0 z-40 bg-white dark:bg-black border-t py-3 px-3">
            <div>Total : {Number(total).toString()} TND</div>

            <FormField
              control={form.control}
              name="discountOnPc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>discount On Pc</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} className="ml-auto my-3 w-full" type="submit">
              Product {action}
            </Button>
          </div>

          <Pctemplate
            Cameras={Cameras}
            CamerasList={CamerasList}
            Chaisegamings={Chaisegamings}
            ChaisegamingsList={ChaisegamingsList}
            DefaultCamera={defaultCamera}
            DefaultChair={DefaultChair}
            DefaultClavier={defaultKeyboard}
            DefaultHeadset={defaultHeadset}
            DefaultManette={DefaultManette}
            DefaultMic={defaultMics}
            DefaultMouse={defaultMouse}
            DefaultMousePad={defaultMousePad}
            DefaultScreen={defaultScreen}
            DefaultSpeaker={DefaultSpeaker}
            Hautparleurs={Hautparleurs}
            HautparleursList={HautparleursList}
            Headsets={Headsets}
            HeadsetsList={HeadsetsList}
            Manettes={Manettes}
            ManettesList={ManettesList}
            Mics={Mics}
            MicsList={MicsList}
            MouseList={MouseList}
            Mousepads={Mousepads}
            MousepadsList={MousepadsList}
            Mouses={Mouses}
            initialData={initialData}
            keyboardList={keyboardList}
            keyboards={keyboards}
            screens={screens}
            screensList={screensList}
            setCamerasList={setCamerasList}
            setChaisegamingsList={setChaisegamingsList}
            setDefaultCamera={setDefaultCamera}
            setDefaultHeadset={setDefaultHeadset}
            setDefaultKeyboard={setDefaultKeyboard}
            setDefaultMics={setDefaultMics}
            setDefaultMouse={setDefaultMouse}
            setDefaultMousePad={setDefaultMousePad}
            setDefaultScreen={setDefaultScreen}
            setDefaultSpeDefaultChair={setDefaultChair}
            setDefaultSpeDefaultManette={setDefaultManette}
            setDefaultSpeDefaultSpeaker={setDefaultSpeaker}
            setHautparleursList={setHautparleursList}
            setHeadsetsList={setHeadsetsList}
            setManettesList={setManettesList}
            setMicsList={setMicsList}
            setMouseList={setMouseList}
            setMousepadsList={setMousepadsList}
            setkeyboardList={setkeyboardList}
            setscreensList={setscreensList}
          />
        </form>
      </Form>

      <div className="h-40" />
    </>
  );
};
