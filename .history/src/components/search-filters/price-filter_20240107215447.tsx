// PriceFilter.tsx
import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import "./pricefilter.css"
// PriceFilter.tsx
import React from 'react';
import { Slider } from '@radix-ui/react-slider';
import "./pricefilter.css"

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}

const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => (
  <Slider.Root
    className="SliderRoot"
    defaultValue={[25, 75]}
    orientation="horizontal"
    onChange={(e) => {
      console.log(e.target.value);
      // Call your handlePriceFilter function with the updated values
      handlePriceFilter(e.target.value);
    }}
  >
    <Slider.Track className="SliderTrack">
      <Slider.Range className="SliderRange" />
    </Slider.Track>
    <Slider.Thumb className="SliderThumb" onDrag={(e) => console.log(e)} />
    <Slider.Thumb className="SliderThumb" />
  </Slider.Root>
);

export default PriceFilter;

