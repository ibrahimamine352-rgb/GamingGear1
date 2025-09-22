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
      signDisplay:'never',
      notation:'engineering',
      
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="price-filter-container">
      <Slider
        label={`Prix: ${formatCurrency(value[0])} TND - ${formatCurrency(value[1])} TND`}
        step={50}
        minValue={0}
        maxValue={1000}
        defaultValue={[100, 500]}
        onChange={(e) => {
          console.log(e);
          handlePriceFilter(e as number[]);
        }}
        className="max-w-md"
      />
    </div>
  );
};

export default PriceFilter;
