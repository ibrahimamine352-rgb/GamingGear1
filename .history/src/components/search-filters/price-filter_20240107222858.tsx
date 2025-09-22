import React from "react";
import {Slider} from "@nextui-org/react";

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}
const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => (

  <div className="price-filter-container">
  <Slider
    label="Prix"
    step={50}
    minValue={0}
    maxValue={1000}
    defaultValue={[100, 500]}
    onChange={(e) => {
      console.log(e);
      handlePriceFilter(e as number[]);
    }}
    formatOptions={{ style: "currency", currency: "TND", unitDisplay: "short", minimumFractionDigits: 0 }}
    className="max-w-md"
  />
</div>
  );
  export default PriceFilter;