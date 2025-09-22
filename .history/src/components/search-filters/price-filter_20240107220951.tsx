// PriceFilter.tsx
import React, { useEffect, useState, ReactElement } from 'react';
import '@radix-ui/react-slider/styles.css'; // Import the Radix Slider styles
import "./pricefilter.css";

interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}

const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => {
  const [SliderComponents, setSliderComponents] = useState<ReactElement | null>(null);

  useEffect(() => {
    import('@radix-ui/react-slider').then((Slider) => {
      // Dynamically import the Slider components
      const { Root, Track, Range, Thumb } = Slider;

      // Set the Slider components in state
      setSliderComponents(
        <Root
          className="SliderRoot"
          defaultValue={[25, 75]}
          step={10}
          minStepsBetweenThumbs={1}
          orientation="horizontal"
          onChange={(e) => {
            console.log('Slider values:', e);
            // Call your handlePriceFilter function with the updated values
      
          }}
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

  return SliderComponents ? <>{SliderComponents}</> : <div>Loading...</div>;
};

export default PriceFilter;
