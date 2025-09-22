import * as Slider from '@radix-ui/react-slider';

export default () => (
  <Slider.Root defaultValue={[50]} step={10}>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>
    <Slider.Thumb />
  </Slider.Root>
);