import React from "react";
import Image from "next/image";

import { ContactUsProps } from "./interface";
import { cn } from "@/lib/util";

export function ContactUs({ className }: ContactUsProps) {
  return (
    <section
      id="contact-us"
      className={cn(
        "mt-[48px] mobile:mt-[24px] grid desktop:grid-cols-[400px_1fr] grid-cols-1 max-w-[1024px] mx-auto text-[14px] text-black-2",
        className
      )}
    >
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-[24px] mobile:text-[16px] font-bold">ติดต่อเรา</h2>
        <Image src="/line-qr.webp" width={200} height={200} alt="logo" />

        <div>
          <h3 className="font-bold">Sales Manager</h3>
          <p>088 598 9844</p>
          <p>BEST SELLER CO., LTD.</p>
          <p>
            3/3,13,15,17,19,21,23,25,33,35,37,39
            <br />
            PhetKasem 77 Yak 4-7, NongKhangPhlu,
            <br />
            NongKhaem, Bangkok 10160
          </p>
        </div>
        <div>
          <h3 className="font-bold">ฝ่ายขาย</h3>
          <p>088 598 9844</p>
          <p>บริษัท เบสท์ เซลเลอร์ จำกัด</p>
          <p>
            3/3,13,15,17,19,21,23,25,33,35,37,39
            <br />
            ซอย เพชรเกษม 77 แยก 4-7 แขวง หนองค้างพลู
            <br />
            เขต หนองเเขม กรุงเทพมหานคร 10160
          </p>
        </div>
      </div>
      <div className="mt-[36px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d589.2637335071158!2d100.3571559!3d13.7020775!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2911bc6c91857%3A0xe1d1756da6aa85c6!2zTWVnYSBTcG9ydHMgR3JvdXAg4LmA4Lih4LiB4LiwIOC4quC4m-C4reC4o-C5jOC4lSDguIHguKPguLjguYrguJs!5e1!3m2!1sen!2sth!4v1734529028535!5m2!1sen!2sth"
          className="w-full h-[550px]"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
