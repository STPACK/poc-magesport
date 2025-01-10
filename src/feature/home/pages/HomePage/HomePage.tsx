import React from "react";

import { SearchInput } from "@/components/SearchInput";
import { RetailSlide } from "../components/RetailSlide";
import { HomePageProps } from "./interface";
import { useRouter } from "next/navigation";

export function HomePage({ retail }: HomePageProps) {
  const router = useRouter();
  return (
    <div>
      <RetailSlide retail={retail} />

      <section className="max-w-[980px] mx-auto mt-[56px] text-black-2 text-[14px]">
        <SearchInput
          placeholder="กรอกหมายเลขคำสั่งซื้อ"
          value=""
          onChange={(value) => router.push(`/tax-invoice?invoiceId=${value}`)}
          className="mb-[18px]"
        />
        <p className="mb-[4px]">
          * กรุณากรอก<strong className="underline">หมายเลขคำสั่งซื้อ</strong>
          ให้ครบถ้วน
        </p>
        <p>
          * สามารถดู<strong className="underline">หมายเลขคำสั่งซื้อ</strong>
          ได้จากคำสั่งในช่องทาง Shopee Lazada Tiktok
        </p>
      </section>
      
    </div>
  );
}
