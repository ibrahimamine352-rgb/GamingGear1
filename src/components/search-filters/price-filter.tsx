
"use client";
import React from "react";
import { Slider } from "@nextui-org/react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { UI_TEXT } from "@/i18n/ui-text";
import { translateFilterTitle } from "@/i18n/filter-titles";
import { useLanguage } from "@/context/language-context";

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
  setLoading: (value: boolean) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  handlePriceFilter,
  value,
  setLoading,
}) => {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 0,
      signDisplay: "never",
    }).format(v);

  return (
    <div className="price-filter-container mt-3">
      <style>{`
        .price-filter-container .next-slider-min,
        .price-filter-container .next-slider-max {
          visibility: hidden;
        }
      `}</style>

      <Slider
        step={1}
        minValue={0}
        maxValue={20000}
        defaultValue={[0, 20000]}
        value={value}
        onChange={(e) => {
          handlePriceFilter(e as number[]);
        }}
        className="max-w-md"
        label={
          <div className="w-full flex justify-between items-center">
            <label className="text-small">
              {ui.priceLabel} {/* e.g. "Price (TND)" */}
            </label>
          </div>
        }
      />

      <div className="grid grid-cols-2 mt-2">
        <div>
          <Label className="text-xs">{ui.minPriceLabel}</Label>
          <Input
            className="mt-2 rounded-r-none"
            type="number"
            value={value[0]}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n) && n >= 0) {
                handlePriceFilter([n, value[1]]);
              }
            }}
          />
        </div>

        <div>
          <Label className="text-xs">{ui.maxPriceLabel}</Label>
          <Input
            type="number"
            className="mt-2 rounded-l-none"
            value={value[1]}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n) && n > 0) {
                handlePriceFilter([value[0], n]);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;