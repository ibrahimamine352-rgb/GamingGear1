"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type ProductFormValues = any;

type PopUpProps = {
  label: string;                      // ✅ primitive string (not String)
  form1: UseFormReturn<ProductFormValues>;
  loading: boolean;
  setLoading: (value: boolean) => void;
  data: Array<Record<string, any>>;
  url: string;
  formLab: string;                    // ✅ primitive string
  formCControlName: string;           // ✅ primitive string
  fieldaAfficher: string;             // ✅ primitive string (e.g. "name")
  IsNumber?: boolean;
};

export const PopFormModal: React.FC<PopUpProps> = ({
  label,
  form1,
  loading,
  setLoading,
  data,
  url,
  formLab,
  formCControlName,
  fieldaAfficher,
  IsNumber,
}) => {
  const router = useRouter();
  const form = form1;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);

  const closeDialogAndCreate = async () => {
    const values = form.getValues();
    const raw = values[formCControlName as keyof typeof values];

    if (!raw || String(raw).trim() === "") {
      form.setError(formCControlName as any, {
        message: `Insert the ${fieldaAfficher}`,
      });
      return;
    }

    try {
      setLoading(true);

      if (IsNumber) {
        const num = Number(raw);
        if (Number.isNaN(num)) {
          toast.error("Please enter a valid number.");
          setLoading(false);
          return;
        }
        await axios.post(url, { number: num });
      } else {
        await axios.post(url, { name: String(raw).trim() });
      }

      toast.success("Created");
      setIsDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Safe label resolver for each option
  const getItemLabel = (item: Record<string, any>) => {
    const preferred = item?.[fieldaAfficher];
    if (preferred !== undefined && preferred !== null && preferred !== "") {
      return String(preferred);
    }
    for (const k of ["name", "label", "title", "value"]) {
      if (item?.[k] !== undefined && item?.[k] !== null) return String(item[k]);
    }
    const first = Object.values(item).find(
      (v) => typeof v === "string" || typeof v === "number"
    );
    return String(first ?? "");
  };

  return (
    <FormField
      control={form.control}
      name={formLab as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <div className="md:grid md:grid-cols-2 items-start gap-8">
            {/* LEFT: scrollable select (list slider appears automatically) */}
            <div>
              <Select
                disabled={loading}
                value={field.value ? String(field.value) : ""}
                onValueChange={(v) => field.onChange(v)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select a ${label}`} />
                  </SelectTrigger>
                </FormControl>

                {/* The 'slider': a capped height with overflow scroll */}
                <SelectContent position="popper" sideOffset={4} className="p-0">
  <div className="max-h-40 overflow-y-auto overscroll-contain">
    {data.map((item) => {
      const id = item?.id ?? getItemLabel(item);
      return (
        <SelectItem key={String(id)} value={String(id)}>
          {getItemLabel(item)}
        </SelectItem>
      );
    })}
  </div>
</SelectContent>
              </Select>

              <FormMessage />
            </div>

            {/* RIGHT: add-new dialog */}
            <div className="w-full">
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={openDialog}
              >
                Add {label}
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                    <DialogDescription>
                      Click save when you’re done.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name={formCControlName as any}
                      render={({ field: dialogField }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            {IsNumber ? (
                              <Input
                                disabled={loading}
                                type="number"
                                value={dialogField.value ? String(dialogField.value) : ""}
                                onChange={dialogField.onChange}
                              />
                            ) : (
                              <Input
                                disabled={loading}
                                type="text"
                                value={dialogField.value ? String(dialogField.value) : ""}
                                onChange={dialogField.onChange}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter className="sm:justify-end">
                    <Button onClick={closeDialogAndCreate} type="button" variant="secondary">
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};
