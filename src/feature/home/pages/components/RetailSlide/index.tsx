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
import { useWindowSize } from "@/hooks/useWindowSize";

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
});

export function RetailSlide({ retail }: RetailSlideProps) {
  const { isDesktop } = useWindowSize();
  return (
    <div className="relative max-w-[1024px] mx-auto">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={isDesktop ? 2 : 1.3}
        initialSlide={1}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2,
          slideShadows: false,
        }}
        navigation={{
          nextEl: `.swiperButtonNext`,
          prevEl: `.swiperButtonPrev`,
        }}
        modules={[EffectCoverflow, Navigation]}
        className="max-w-[850px] mx-auto"
      >
        {retail.map((item) => (
          <SwiperSlide
            key={item.id}
            onClick={() => window.open(item.shopLink)}
            className="cursor-pointer shop-image  mobile-tablet:blur-[1px]"
          >
            <div className="w-full aspect-[3/4] shop-image">
              <Image
                fill
                src={item.imageUrl}
                alt={item.name}
                className="object-contain w-full aspect-[3/4]"
              />
            </div>
            <div className="text-center mt-[64px] shop-name opacity-0">
              <h3 className="desktop:text-[24px] text-[16px] font-semibold text-black-2 underline">
                {item.name}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiperButtonPrev absolute top-1/2 -left-[30px] -translate-y-1/2 z-10 cursor-pointer mobile-tablet:hidden">
        <LeftOutlined className="text-[32px] text-black-2" />
      </div>

      <div className="swiperButtonNext absolute top-1/2 -right-[30px] -translate-y-1/2 z-10 cursor-pointer mobile-tablet:hidden">
        <RightOutlined className="text-[32px] text-black-2" />
      </div>
    </div>
  );
}
