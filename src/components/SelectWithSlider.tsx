"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type Option = { id: string; name: string };

type SelectWithSliderProps = {
  label: string;
  placeholder?: string;
  options: Option[];
  value: string | undefined;
  onChange: (id: string) => void;
  sliderLabel?: string;
  sliderValue: number;
  onSliderChange: (v: number) => void;
  className?: string;
};

export function SelectWithSlider({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  sliderLabel = "Priority",
  sliderValue,
  onSliderChange,
  className,
}: SelectWithSliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm">{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="md:col-span-2">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-70">{sliderLabel}</span>
            <span className="px-2 py-0.5 border rounded-md">{sliderValue}</span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[sliderValue]}
            onValueChange={(arr) => onSliderChange(arr[0] ?? 0)}
          />
          <span className="text-[10px] opacity-50">* UI only — not saved</span>
        </div>
      </div>
    </div>
  );
}
