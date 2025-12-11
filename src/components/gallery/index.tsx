"use client";

import Image from "next/image";
import { Tab } from "@headlessui/react";

import { Image as TImage } from "@/types";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
  images: TImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  // If no images, don’t render anything
  if (!images.length) return null;

  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      {/* Thumbnails */}
      <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <GalleryTab key={image.id ?? image.url} image={image} />
          ))}
        </Tab.List>
      </div>

      {/* Main image panels */}
      <Tab.Panels className="mt-4 w-full">
        {images.map((image, index) => (
          <Tab.Panel
            key={image.id ?? image.url}
            className="focus:outline-none"
          >
            <div className="relative w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-white/5 to-white/0">
              {/* aspect-ratio box to prevent CLS */}
              <div className="relative w-full pb-[100%] sm:pb-[75%]">
                <Image
                  src={image.url}
                  alt="Gaming Gear TN product image"
                  fill
                  className="object-contain"
                  // Help browser choose correct size
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw"
                  // First image = LCP hero: eager + priority
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;
