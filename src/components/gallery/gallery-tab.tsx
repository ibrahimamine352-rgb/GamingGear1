import NextImage from "next/image";
import { Tab } from "@headlessui/react";

import { cn } from "@/lib/utils";
import { Image } from "@/types";

interface GalleryTabProps {
  image: Image;
}

const GalleryTab: React.FC<GalleryTabProps> = ({
  image
}) => {
  return (
    <Tab
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-border bg-card/70 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
    >
      {({ selected }) => (
        <div>
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-xl">
            <NextImage 
              fill 
              src={image.url} 
              alt="" 
              className="object-cover object-center rounded-xl" 
            />
          </span>
          <span
            className={cn(
              'absolute inset-0 rounded-xl ring-2 ring-offset-2 transition-all duration-300',
              selected ? 'ring-[#00e0ff] shadow-[0_0_10px_rgba(0,224,255,0.3)]' : 'ring-transparent',
            )}
          />
        </div>
      )}
    </Tab>
  );
}
 
export default GalleryTab;
