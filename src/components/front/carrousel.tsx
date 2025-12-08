"use client";

import React, { useEffect, useState } from "react";
import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./Carousel.css";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Link from "next/link";
import Image from "next/image";

export type SlidesColumn = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  bgUrl: string;
  mobilebgURl: string;
  url: string;
  createdAt: string;
  discount: number;
  descriptionColor: string;
  titleColor: string;
  Price: string;
  PriceColor: string;
  DeletedPrice: string;
  DeletedPriceColor: string;
};

interface SlideshowProps {
  slides: SlidesColumn[];
}

const Slideshow: React.FC<SlideshowProps> = ({ slides }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // 768px breakpoint = mobile-ish
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // initial check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card className="my-10 border-0 p-0 max-sm:h-auto max-sm:pb-5 card-gaming opacity-95 max-sm:rounded-none">
      <CardContent className="p-0 m-0">
        <Zoom
          cssClass="card"
          scale={1.4}
          duration={5000}
          infinite
          canSwipe
          indicators
        >
          {slides.map((each) => (
            <div
              key={each.id}
              style={{
                width: "100%",
                backgroundImage: `url(${
                  isMobile ? each.mobilebgURl : each.bgUrl
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="container flex flex-row items-center h-full max-sm:flex-col-reverse"
            >
              {/* LEFT TEXT AREA */}
              <div className="basis-2/3 p-28 dark:text-foreground max-sm:p-4 max-sm:flex max-sm:flex-col max-sm:items-start">
                {each.title?.length > 0 && (
                  <h1
                    className="p-3 font-black tracking-wider text-2xl slideTitle bg-opacity-30"
                    style={{
                      color: each.titleColor?.length ? each.titleColor : undefined,
                    }}
                  >
                    {each.title}
                  </h1>
                )}

                {each.description?.length > 0 && (
                  <p
                    className="py-7"
                    style={{
                      color: each.descriptionColor?.length
                        ? each.descriptionColor
                        : undefined,
                    }}
                  >
                    {each.description}
                  </p>
                )}

                {each.DeletedPrice?.length > 0 && (
                  <p
                    className="pt-2 line-through font-semibold"
                    style={{
                      color: each.DeletedPriceColor?.length
                        ? each.DeletedPriceColor
                        : undefined,
                    }}
                  >
                    {each.DeletedPrice} TND
                  </p>
                )}

                {each.Price?.length > 0 && (
                  <p
                    className="pb-2 font-semibold"
                    style={{
                      color: each.PriceColor?.length ? each.PriceColor : undefined,
                    }}
                  >
                    {each.Price} TND
                  </p>
                )}

                {each.url?.length > 0 && (
                  <div className="flex items-center gap-3 max-sm:w-full">
                    <Link className="max-sm:w-full" href={each.url}>
                      <Button className="max-sm:w-full btn-neon" variant="default">
                        Shop
                      </Button>
                    </Link>
                    <Label className="pl-1">
                      {each.discount > 0 ? `${each.discount}%` : ""}
                    </Label>
                  </div>
                )}
              </div>

              {/* RIGHT IMAGE */}
              {each.imageUrl?.length > 0 && (
                <div className="basis-1/3">
                  <Image
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className="slideImage p-10"
                    alt={each.title || "Slide Image"}
                    src={each.imageUrl}
                  />
                </div>
              )}
            </div>
          ))}
        </Zoom>
      </CardContent>
    </Card>
  );
};

export default Slideshow;
