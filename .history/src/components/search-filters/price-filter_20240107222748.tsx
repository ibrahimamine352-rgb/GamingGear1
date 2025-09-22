import React from "react";
import {Slider} from "@nextui-org/react";

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}
const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => (

    <Slider
      label="Prix"
      step={50} 
      minValue={0} 
      maxValue={1000} 
      defaultValue={[100, 500]} 
      onChange={(e)=>{
        console.log(e)
        handlePriceFilter(e as number[])
      }}
      formatOptions={{style: "currency", currency: "TND" ,unitDisplay:"short",minimumFractionDigits:0}}
      // Align the label to the start of the Slider
      labelPosition="end" // Position the label at the end of the Slider
    
      className="max-w-md"
    />
  );
  export default PriceFilter;