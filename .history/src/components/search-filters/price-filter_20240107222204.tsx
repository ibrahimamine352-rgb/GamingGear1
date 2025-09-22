import React from "react";
import {Slider} from "@nextui-org/react";

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}
const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => (

    <Slider
      label="prix"
      step={50} 
      minValue={0} 
      maxValue={1000} 
      defaultValue={[100, 500]} 
      onChange={(e)=>{
        console.log(e)
      }}
      formatOptions={{style: "currency", currency: "TND"}}
      className="max-w-md"
    />
  );
  export default PriceFilter;