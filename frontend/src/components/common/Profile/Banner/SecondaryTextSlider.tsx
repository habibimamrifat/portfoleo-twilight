"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

interface SecondaryTextSliderProps {
  texts: string[];
}

export default function SecondaryTextSlider({
  texts,
}: SecondaryTextSliderProps) {
  const validTexts = texts.filter(
    (text) => text.trim(),
  );

  if (!validTexts.length) {
    return null;
  }

  return (
    <div
      className="
        w-full
        min-h-[70px]
        sm:min-h-[75px]
        lg:min-h-[80px]
      "
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={validTexts.length > 1}
        slidesPerView={1}
        allowTouchMove={validTexts.length > 1}
      >
        {validTexts.map((text, index) => (
          <SwiperSlide key={`${index}-${text}`}>
            <p
              className="
                text-sm
                leading-6
                text-white/60
                sm:text-base
                sm:leading-7
              "
            >
              {text}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}