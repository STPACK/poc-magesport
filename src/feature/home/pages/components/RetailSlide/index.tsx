"use client";

import React from "react";
import dynamic from "next/dynamic";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Navigation } from "swiper/modules";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { RetailSlideProps } from "./interface";
import Image from "next/image";
import { SwiperSlide } from "swiper/react";

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
});

export function RetailSlide({ retail }: RetailSlideProps) {
  return (
    <div className="relative max-w-[880px] mx-auto">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={2}
        initialSlide={1}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2.5,
          slideShadows: false,
        }}
        navigation={{
          nextEl: `.swiperButtonNext`,
          prevEl: `.swiperButtonPrev`,
        }}
        modules={[EffectCoverflow, Navigation]}
        className="max-w-[820px] mx-auto"
      >
        {retail.map((item) => (
          <SwiperSlide
            key={item.id}
            onClick={() => window.open(item.shopLink)}
            className="cursor-pointer"
          >
            <div className="w-full aspect-[3/4]">
              <Image
                fill
                src={item.imageUrl}
                alt={item.name}
                className="object-contain w-full aspect-[3/4]"
              />
            </div>
            <div className="text-center mt-[64px] shop-name opacity-0">
              <h3 className="text-[24px] font-semibold text-black-2 underline">
                {item.name}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiperButtonPrev absolute top-1/2 -left-[30px] -translate-y-1/2 z-10 cursor-pointer">
        <LeftOutlined className="text-[32px] text-black-2" />
      </div>

      <div className="swiperButtonNext absolute top-1/2 -right-[30px] -translate-y-1/2 z-10 cursor-pointer">
        <RightOutlined className="text-[32px] text-black-2" />
      </div>
    </div>
  );
}
