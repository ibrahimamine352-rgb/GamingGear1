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
    step={10} minStepsBetweenThumbs={1}
    orientation="horizontal"
    onClick={() => console.log('onMouseDown')}
    onMouseDown={() => console.log('onMouseDown')}
    onMouseUp={() => console.log('onMouseUp')}
 
  >
    <Slider.Track className="SliderTrack">
      <Slider.Range className="SliderRange" />
    </Slider.Track>
    <Slider.Thumb className="SliderThumb"    onMouseDown={() => console.log('onMouseDown')}
    onMouseUp={() => console.log('onMouseUp')}
 />
    <Slider.Thumb className="SliderThumb" />
  </Slider.Root>
);

export default PriceFilter;