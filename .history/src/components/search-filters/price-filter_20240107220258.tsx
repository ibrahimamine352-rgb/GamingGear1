// PriceFilter.tsx
import React, { useEffect } from 'react';

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}

const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => {
  useEffect(() => {
    import('@radix-ui/react-slider').then((Slider) => {
      // Dynamically import the Slider components
      const { Root, Track, Range, Thumb } = Slider;

      return (
        <Root
          className="SliderRoot"
          defaultValue={[25, 75]}
          step={10}
          minStepsBetweenThumbs={1}
          orientation="horizontal"
          onChange={() => console.log('onMouseDown')}
          onMouseDown={() => console.log('onMouseDown')}
          onMouseUp={() => console.log('onMouseUp')}
        >
          <Track className="SliderTrack">
            <Range className="SliderRange" />
          </Track>
          <Thumb
            className="SliderThumb"
            onMouseDown={() => console.log('onMouseDown')}
            onMouseUp={() => console.log('onMouseUp')}
          />
          <Thumb className="SliderThumb" />
        </Root>
      );
    });
  }, []); // Run this effect only once during component mount

  return (
    // Placeholder for your component, you can customize it as needed
    <div>Loading...</div>
  );
};

export default PriceFilter;
