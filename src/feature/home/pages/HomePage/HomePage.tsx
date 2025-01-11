import React from "react";

import { RetailSlide } from "../components/RetailSlide";
import { HomePageProps } from "./interface";
import { ContactUs } from "@/components/ContactUs";

export function HomePage({ retail }: HomePageProps) {
  return (
    <div className="desktop:px-0 px-[16px]">
      <RetailSlide retail={retail} />
      <ContactUs className="mt-[100px]" />
    </div>
  );
}
