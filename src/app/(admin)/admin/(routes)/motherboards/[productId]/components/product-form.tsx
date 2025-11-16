"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import {
  Category,
  Image,
  Product,
  Manufacturer,
  RamSlots,
  MotherboardChipset,
  CPUSupport,
  MotherboardFormat,
  Motherboard,
  Field,
} from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PopFormModal } from "../../components/formtoupdate";
import { Ramform } from "../../ramform";
import InputArray from "../../../products/[productId]/components/addtioanlinfos";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  comingSoon: z.boolean().default(false).optional(),
  outOfStock: z.boolean().default(false).optional(),
  manufacturerId: z.string().min(1),
  ramslotsId: z.string().min(1),
  chipsetId: z.string().min(1),
  cpusupportId: z.string().min(1),
  formatId: z.string().min(1),
  motherboardFormat: z.string().optional(),
  manifacturername: z.string().optional(),
  ramslots: z.number().optional(),
  cpusupport: z.string().optional(),
  dicountPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(1),
  description: z.string().min(1),
  additionalDetails: z.object({ name: z.string(), value: z.string() }).array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        motherboard: Motherboard[];
        additionalDetails: Field[];
      })
    | null;
  categories: Category[];
  manufacturers: Manufacturer[];
  ramslots: RamSlots[];
  chipset: MotherboardChipset[];
  cpusupport: CPUSupport[];
  format: MotherboardFormat[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  manufacturers,
  ramslots,
  chipset,
  cpusupport,
  format,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues =
    initialData && initialData.motherboard
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          dicountPrice: parseFloat(String(initialData?.dicountPrice)),
          stock: parseFloat(String(initialData?.stock)),
          cpusupportId: initialData.motherboard[0].cpusupportId,
          chipsetId: initialData.motherboard[0].chipsetId,
          formatId: initialData.motherboard[0].formatId,
          manufacturerId: initialData.motherboard[0].manufacturerId,
          ramslotsId: initialData.motherboard[0].ramslotsId,
          additionalDetails: (initialData?.additionalDetails || []).map(
            (item) => ({
              name: item.name,
              value: item.value,
            })
          ),
        }
      : {
          name: "",
          images: [],
          price: 0,
          dicountPrice: 0,
          stock: 0,
          description: "",
          categoryId: "",
          isFeatured: false,
          isArchived: false,
          comingSoon: false,
          outOfStock: false,
          additionalDetails: [],
        };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/motherboard/component/${params.productId}`, data);
      } else {
        await axios.post(`/api/motherboard/component`, data);
      }
      router.refresh();
      router.push(`/admin/motherboards`);
      toast.success(toastMessage);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Add-manufacturer dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newManufacturerName, setNewManufacturerName] = useState("");

  const openDialog = () => setIsDialogOpen(true);

  const closeDialog = async () => {
    if (newManufacturerName.trim()) {
      try {
        setLoading(true);
        await axios.post(`/api/motherboard/manufacturer`, {
          name: newManufacturerName.trim(),
          imageUrl: "",
        });
        toast.success(toastMessage);
        setNewManufacturerName("");
        router.refresh();
        setIsDialogOpen(false);
      } catch {
        toast.error("Something went wrong.");
        setIsDialogOpen(false);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Insert the name");
      setIsDialogOpen(false);
    }
  };

  // Manufacturer image preview (optional)
  const [manifacturerimg, setmanifacturerimg] = useState<string[]>([]);
  const [manifacturerimgdrop, setmanifacturerimgdrop] = useState(false);

  const manufacturerImg = () => {
    if (form.getValues().manufacturerId) setmanifacturerimgdrop(true);
    else setmanifacturerimgdrop(false);

    const selectedId = form.getValues().manufacturerId;
    const m = manufacturers.find((x) => x.id === selectedId);
    if (m?.imageUrl) setmanifacturerimg([m.imageUrl]);
    else setmanifacturerimg([]);
  };

  const uploadImg = async (url: string) => {
    if (!url) return;
    try {
      setLoading(true);
      const selectedId = form.getValues().manufacturerId;
      const m = manufacturers.find((x) => x.id === selectedId);
      await axios.patch(`/api/motherboard/manufacturer/${selectedId}`, {
        imageUrl: url,
        name: m?.name,
      });
      toast.success(toastMessage);
      setmanifacturerimg([url]);
      router.refresh();
    } catch (error: any) {
toast.error(("Something went wrong. " + (error?.message ?? "")));
    } finally {
      setLoading(false);
    }
  };

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
          {/* PRODUCT IMAGES (fixed) */}
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
                      field.onChange(field.value.filter((i) => i.url !== url))
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
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
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

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Discount Price</FormLabel>
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
                <FormItem>
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
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
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
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
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
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Out of Stock</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* MANUFACTURER with scroll + dialog */}
          <FormField
            control={form.control}
            name="manufacturerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturers</FormLabel>

                <div className="md:grid md:grid-cols-2 items-start gap-8">
                  {/* LEFT: scrollable select */}
                  <div>
                    <Select
                      disabled={loading}
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        manufacturerImg();
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manufacturer" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent position="popper" sideOffset={4} className="max-h-64 p-0">
                        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700/60 scrollbar-track-transparent">
                          {manufacturers.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </div>

                  {/* RIGHT: Add manufacturer dialog */}
                  <div className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={openDialog}
                    >
                      Add manufacturer
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Manufacturers</DialogTitle>
                          <DialogDescription>Click save when you’re done.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <FormLabel htmlFor="new-manufacturer">Name</FormLabel>
                          <Input
                            id="new-manufacturer"
                            disabled={loading}
                            placeholder="Manufacturer name"
                            value={newManufacturerName}
                            onChange={(e) => setNewManufacturerName(e.target.value)}
                          />
                        </div>

                        <DialogFooter className="sm:justify-end">
                          <Button onClick={closeDialog} type="button" variant="secondary">
                            save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {manifacturerimgdrop ? (
                      <div className="mt-3 flex items-center gap-3">
                        <Button type="button" className="ml-0" variant="destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  {/* optional manufacturer image uploader */}
                  {manifacturerimgdrop ? (
                    <div className="col-span-2">
                      <ImageUpload
                        value={manifacturerimg}
                        onChange={(url) => uploadImg(url)}
                        onRemove={() => form.setValue("manufacturerId", "")}
                      />
                    </div>
                  ) : null}
                </div>
              </FormItem>
            )}
          />

          <Separator />

          {/* RAM SLOTS */}
          <FormField
            control={form.control}
            name="ramslotsId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ram Slot</FormLabel>
                <div className="md:grid md:grid-cols-2 items-start gap-8">
                  <div>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a RAM slot" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent position="popper" sideOffset={4} className="max-h-64 p-0">
                        <div className="max-h-64 overflow-y-auto">
                          {ramslots.map((rs) => (
                            <SelectItem key={rs.id} value={rs.id}>
                              {rs.name ?? `${rs.number}${rs.type ? ` ${rs.type}` : ""}`}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>

                  <div>
                    <Ramform />
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* OTHER LOOKUPS */}
          <div className="md:grid md:grid-cols-2 items-start gap-8">
            <PopFormModal
              label={"Motherboard Chipset"}
              form1={form}
              loading={loading}
              setLoading={setLoading}
              data={chipset}
              fieldaAfficher="name"
              url="/api/motherboard/MotherboardChipset"
              formLab="chipsetId"
              formCControlName="chipset"
              IsNumber={false}
            />

            <PopFormModal
              label={"CPU Support"}
              form1={form}
              loading={loading}
              setLoading={setLoading}
              data={cpusupport}
              fieldaAfficher="name"
              url="/api/motherboard/CPUSupport"
              formLab="cpusupportId"
              formCControlName="cpusupport"
              IsNumber={false}
            />

            <PopFormModal
              label={"Motherboard format"}
              form1={form}
              loading={loading}
              setLoading={setLoading}
              data={format}
              fieldaAfficher="name"
              url="/api/motherboard/motherboardFormat"
              formLab="formatId"
              formCControlName="motherboardFormat"
              IsNumber={false}
            />
          </div>

          <Separator />

          {/* Additional Infos */}
          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Infos</FormLabel>
                <FormControl>
                  <InputArray
                    onChange={(arr: any[]) => field.onChange([...arr])}
                    inputArrayp={field.value.map((i) => ({ name: i.name, value: i.value }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
