// PriceFilter.tsx
import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import "./pricefilter.css"

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value:number[]
}
const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter }) => (

 <Slider.Root
    className="SliderRoot"
    defaultValue={[25, 75]}
    orientation="horizontal"
   
    onChange={(e)=>{
      console.log(e)
    }}
  >
    <Slider.Track className="SliderTrack">
      <Slider.Range className="SliderRange" />
    </Slider.Track>
    <Slider.Thumb className="SliderThumb"  onChange={(e)=>{
      console.log(e)
    }} />
    <Slider.Thumb className="SliderThumb" />
  </Slider.Root>
);

export default PriceFilter;
