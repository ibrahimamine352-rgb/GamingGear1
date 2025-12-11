import Image from "next/image";
import { Tab } from "@headlessui/react";

import { cn } from "@/lib/utils";
import { Image as TImage } from "@/types";

interface GalleryTabProps {
  image: TImage;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-border bg-card/70 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 focus:outline-none">
      {({ selected }) => (
        <div className="relative h-full w-full">
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <Image
              fill
              src={image.url}
              alt="Miniature produit Gaming Gear TN"
              className="object-cover object-center"
              sizes="80px"
              loading="lazy"
              decoding="async"
            />
          </span>
          <span
            className={cn(
              "absolute inset-0 rounded-xl ring-2 ring-offset-2 transition-all duration-300",
              selected
                ? "ring-[#00e0ff] shadow-[0_0_10px_rgba(0,224,255,0.3)]"
                : "ring-transparent"
            )}
          />
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;
