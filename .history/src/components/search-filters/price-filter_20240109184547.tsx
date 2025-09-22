import React from "react";
import { Slider } from "@nextui-org/react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
  setLoading: (value:boolean) => void
}

const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value,setLoading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 0,
      signDisplay: 'never',
    }).format(value);
  };

  return (
    <div className="price-filter-container mt-3" >
      <style>{`
        .price-filter-container .next-slider-min, .price-filter-container .next-slider-max {
          visibility: hidden;
        }
      `}</style>
      <Slider
        step={1}
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
      <div className="grid grid-cols-2 mt-2">
        <div>
          <Label>Min (en TND)</Label>
          <Input className=" mt-2 rounded-r-none" type="number" value={value[0]} onChange={(e)=>{
             if(!Number.isNaN(parseInt(e.target.value))&&parseInt(e.target.value)>=0){
              setLoading(true)
              
            handlePriceFilter([parseInt(e.target.value),value[1]])}
             }} />
        </div>
        <div>
          <Label>Max (en TND)</Label>
          <div>
          <Input type="number" className=" mt-2"  value={value[1]} onChange={(e)=>{
            if(!Number.isNaN(parseInt(e.target.value))&&parseInt(e.target.value)>0){
              setLoading(true)
              handlePriceFilter([value[0],parseInt(e.target.value)])}
            }
           } />
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
