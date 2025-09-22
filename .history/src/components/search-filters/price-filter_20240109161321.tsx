import React from "react";
import { Slider } from "@nextui-org/react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}

const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 0,
      signDisplay: 'never',
    }).format(value);
  };

  return (
    <div className="price-filter-container">
      <style>{`
        .price-filter-container .next-slider-min, .price-filter-container .next-slider-max {
          visibility: hidden;
        }
      `}</style>
      <Slider
        step={100}
        minValue={0}
        maxValue={20000}
        defaultValue={[0, 5000]}
        value={value}
        onChange={(e) => {
          console.log(e);
          handlePriceFilter(e as number[]);
        }}
        className="max-w-md"
        label={
          <div className="w-full flex justify-between items-center">
            <label className="text-small">
              Prix en TND : 
            </label>
          </div>
        }
      />
      <div className="grid grid-cols-2">
        <div>
          <Label>Min</Label>
          <Input value={value[0]} onChange={(e)=>handlePriceFilter([parseInt(e.target.value),value[1]])} />
        </div>

      </div>
    </div>
  );
};

export default PriceFilter;
