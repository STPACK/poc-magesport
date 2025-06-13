import React from "react";

import { RetailSlide } from "../components/RetailSlide";
import { HomePageProps } from "./interface";
import { ContactUs } from "@/components/ContactUs";
import { BannerList } from "../components/BannerList";
import { PartnerList } from "../components/PartnerList";

export function HomePage({ retail }: HomePageProps) {
  return (
    <div className="desktop:px-0 px-[16px] mobile-tablet:px-[8px]">
      <RetailSlide retail={retail} />
      <PartnerList className="my-[48px]" />
      <BannerList className="my-[48px]" />
      <ContactUs className="mt-[100px]" />
    </div>
  );
}
