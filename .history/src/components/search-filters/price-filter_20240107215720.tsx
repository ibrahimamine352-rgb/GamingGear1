"use client"
import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import "./pricefilter.css"
// PriceFilter.tsx


interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}

const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => (
  <Slider.Root
    className="SliderRoot"
    defaultValue={[25, 75]}
    orientation="horizontal"
 
  >
    <Slider.Track className="SliderTrack">
      <Slider.Range className="SliderRange" />
    </Slider.Track>
    <Slider.Thumb className="SliderThumb"   onDrag={(e) => {
     console.log("edaziedjzaij")
    }} />
    <Slider.Thumb className="SliderThumb" />
  </Slider.Root>
);

export default PriceFilter;