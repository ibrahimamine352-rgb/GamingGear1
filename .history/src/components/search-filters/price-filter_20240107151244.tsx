// PriceFilter.tsx
import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import "pricefilter.css"
const PriceFilter: React.FC = () => (
  <Slider.Root defaultValue={[50]} step={10}>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>
    <Slider.Thumb />
  </Slider.Root>
);

export default PriceFilter;
