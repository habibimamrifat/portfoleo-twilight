"use client";

import { useState } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

interface ImageSwiperProps {
  images: string[];
  alt?: string;
}

export default function ImageSwiper({
  images,
  alt = "Image",
}: ImageSwiperProps) {
  const [thumbsSwiper, setThumbsSwiper] =
    useState<SwiperType | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Main Slider */}
      <Swiper
        spaceBetween={10}
        thumbs={{
          swiper:
            thumbsSwiper && !thumbsSwiper.destroyed
              ? thumbsSwiper
              : null,
        }}
        modules={[FreeMode, Thumbs]}
        className="mySwiper2"
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-white/5 sm:h-[340px] lg:h-[400px]">
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                width={1600}
                height={900}
                unoptimized
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 900px"
                className="h-full w-full object-contain p-2"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Slider */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode
          watchSlidesProgress
          centerInsufficientSlides
          modules={[FreeMode, Thumbs]}
          className="mySwiper mt-3"
          breakpoints={{
            0: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={`thumb-${image}-${index}`}>
              <div className="relative flex aspect-[2.5/1] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-white/30">
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  sizes="150px"
                  className="object-contain p-1"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}