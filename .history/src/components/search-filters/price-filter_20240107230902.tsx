import React from "react";
import { Slider } from "@nextui-org/react";

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
        step={50}
        minValue={0}
        maxValue={10000}
        defaultValue={[100, 500]}
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
    </div>
  );
};

export default PriceFilter;
