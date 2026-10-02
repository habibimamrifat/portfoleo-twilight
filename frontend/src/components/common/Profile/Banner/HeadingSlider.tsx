"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

interface HeadingSliderProps {
  texts: string[];
}

export default function HeadingSlider({
  texts,
}: HeadingSliderProps) {
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
        min-h-[120px]
        sm:min-h-[130px]
        lg:min-h-[150px]
      "
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={validTexts.length > 1}
        slidesPerView={1}
        allowTouchMove={validTexts.length > 1}
      >
        {validTexts.map((text, index) => (
          <SwiperSlide key={`${index}-${text}`}>
            <h1
              className="
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                sm:text-4xl
                lg:text-6xl
              "
              style={{
                color: "transparent",
                WebkitTextFillColor: "transparent",
                WebkitTextStroke:
                  "2px rgba(180, 220, 255, 0.9)",
              }}
            >
              {text}
            </h1>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}