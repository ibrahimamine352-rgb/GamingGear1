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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Textarea } from "@/components/ui/textarea";

import Pctemplate from "./pc-template";
import { ProdCol } from "@/types";

type PackType = "CUSTOM" | "UNITY_SCREEN";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),

  // 👇 REQUIRED for RHF tracking
  unityIds: z.string().array(),
  screenIds: z.string().array(),
  packIds: z.string().array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function ProductForm({
  initialData,
  categories,
  screens,
  unities,
  packs,
}: {
  initialData: any | null;
  categories: Category[];
  screens: ProdCol[];
  unities: ProdCol[];
  packs: ProdCol[];
}) {
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      unityIds: initialData?.FullPack?.[0]?.Unity?.map((u: ProdCol) => u.id) ?? [],
      screenIds: initialData?.FullPack?.[0]?.Screen?.map((s: ProdCol) => s.id) ?? [],
      packIds: initialData?.FullPack?.[0]?.Pack?.map((p: ProdCol) => p.id) ?? [],
    },
  });

  /** Selector state */
  const [unityList, setUnityList] = useState<ProdCol[]>([]);
  const [screensList, setScreensList] = useState<ProdCol[]>([]);
  const [packList, setPackList] = useState<ProdCol[]>([]);

  const [defaultUnity, setDefaultUnity] = useState("");
  const [defaultScreen, setDefaultScreen] = useState("");
  const [defaultPack, setDefaultPack] = useState("");

  /** 🔑 SYNC selectors → RHF */
  useEffect(() => {
    form.setValue(
      "unityIds",
      unityList.map((u) => u.id),
      { shouldDirty: true }
    );
  }, [unityList, form]);

  useEffect(() => {
    form.setValue(
      "screenIds",
      screensList.map((s) => s.id),
      { shouldDirty: true }
    );
  }, [screensList, form]);

  useEffect(() => {
    form.setValue(
      "packIds",
      packList.map((p) => p.id),
      { shouldDirty: true }
    );
  }, [packList, form]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await axios.post("/api/Pack", {
        ...data,
        packType: "UNITY_SCREEN" as PackType,
        DefaultUnity: defaultUnity,
        DefaultScreen: defaultScreen,
        DefaultPack: defaultPack,
      });

      toast.success("Pack saved");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

       {/* Pickers */}
<Pctemplate
  unity={unityList}
  screen={screensList}
  pack={packList}

  setUnity={setUnityList}
  setScreen={setScreensList}
  setPack={setPackList}

  defaultUnity={defaultUnity}
  defaultScreen={defaultScreen}
  defaultPack={defaultPack}

  setDefaultUnity={setDefaultUnity}
  setDefaultScreen={setDefaultScreen}
  setDefaultPack={setDefaultPack}

  unities={unities}
  screens={screens}
  packs={packs}
/>


        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
