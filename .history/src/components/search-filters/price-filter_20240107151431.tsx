// PriceFilter.tsx
import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import "./pricefilter.css"
const PriceFilter: React.FC = () => (

 <Slider.Root
    className="SliderRoot"
    defaultValue={[50]}
    orientation="vertical"
  >
    <Slider.Track className="SliderTrack">
      <Slider.Range className="SliderRange" />
    </Slider.Track>
    <Slider.Thumb className="SliderThumb" />
    <Slider.Thumb className="SliderThumb" />
  </Slider.Root>
);

export default PriceFilter;
