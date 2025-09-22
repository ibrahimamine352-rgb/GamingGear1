// PriceFilter.tsx
import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import "./pricefilter.css"

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
}
const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter }) => (

 <Slider.Root
    className="SliderRoot"
    defaultValue={[25, 75]}
    orientation="horizontal"

    onChange={()=>handlePriceFilter}
  >
    <Slider.Track className="SliderTrack">
      <Slider.Range className="SliderRange" />
    </Slider.Track>
    <Slider.Thumb className="SliderThumb" />
    <Slider.Thumb className="SliderThumb" />
  </Slider.Root>
);

export default PriceFilter;
