"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type AnyValues = Record<string, any>;

interface PopUpProps<TFormValues extends AnyValues = AnyValues> {
  label: string;
  form1: UseFormReturn<TFormValues>;
  loading: boolean;
  setLoading: (v: boolean) => void;
  data: any[];                 // list of options from the server
  url: string;                 // POST endpoint to create a new option
  formLab: keyof TFormValues;  // the field in the parent form that stores the *ID* (e.g. "cpusupportId")
  formCControlName: string;    // only used as a label in the dialog
  fieldaAfficher: string;      // property to display as label (e.g. "name")
  IsNumber?: boolean;          // whether the dialog input is numeric
}

export const PopFormModal = <TFormValues extends AnyValues = AnyValues>({
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
}: PopUpProps<TFormValues>) => {
  const router = useRouter();
  const form = form1;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState<string>(""); // keep new name locally

  useEffect(() => {
    // no-op, but keeps the behavior you had
  }, []);

  const openDialog = () => {
    setNewOptionName("");
    setIsDialogOpen(true);
  };

  const closeDialogAndCreate = async () => {
    if (!newOptionName.trim()) {
      toast.error(`Insert the ${fieldaAfficher}`);
      return;
    }

    try {
      setLoading(true);
      await axios.post(url, { name: IsNumber ? Number(newOptionName) : newOptionName });
      toast.success("created");
      setIsDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name={formLab as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="md:grid md:grid-cols-2 items-start gap-8">
            <div>
            <Select
  onValueChange={(val: string) => {
    // convert to number if needed, otherwise keep as string
    form1.setValue(formLab as any, IsNumber ? Number(val) : (val as any));
  }}
  value={String(form1.watch(formLab as any) ?? "")}
>
  <FormControl>
    <SelectTrigger>
      <SelectValue placeholder={`Select ${formCControlName}`} />
    </SelectTrigger>
  </FormControl>

  {/* Scrollable dropdown */}
  <SelectContent
    position="popper"
    sideOffset={4}
    className="max-h-64 p-0"
  >
    <div className="max-h-64 overflow-y-auto">
      {data.map((row: any) => (
        <SelectItem key={row.id} value={String(row.id)}>
          {row[fieldaAfficher]}
        </SelectItem>
      ))}
    </div>
  </SelectContent>
</Select>


              <FormMessage />
            </div>

            <div className="w-full">
              <Button type="button" className="w-full" variant="outline" onClick={openDialog}>
                Add {label}
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                    <DialogDescription>Click save when you&apos;re done.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <FormLabel>Name</FormLabel>
                    <Input
                      disabled={loading}
                      type={IsNumber ? "number" : "text"}
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
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
