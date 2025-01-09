import React from "react";

import { HomePageProps } from "./interface";
import { RetailSlide } from "../components/RetailSlide";
import Search from "antd/es/input/Search";

export function HomePage({ retail }: HomePageProps) {
  return (
    <div>
      <RetailSlide retail={retail} />

      <section className="max-w-[880px] mx-auto">
        <Search
          placeholder="input search text"
          onSearch={(value) => {
            console.log(value);
          }}
          enterButton
          allowClear
          size="large"
        />
      </section>
      <section
        id="contact-us"
        className="mt-[48px] grid grid-cols-2 max-w-[880px] mx-auto text-[14px] text-black-2"
      >
        <div className="flex flex-col gap-[16px]">
          <h1 className="text-[18px] font-bold">Contact Us</h1>
          <div>
            <h2>Sales Manager</h2>
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
            <h2>ฝ่ายขาย</h2>
            <p>088 598 9844</p>
            <p>บริษัท เบสท์ เซลเลอร์ จำกัด</p>
            <p>
              3/3,13,15,17,19,21,23,25,33,35,37,39
              <br />
              ซอย เพชรเกษม 77 แยก 4-7
              <br />
              แขวง หนองค้างพลู เขต หนองเเขม กรุงเทพมหานคร 10160
            </p>
          </div>
        </div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d589.2637335071158!2d100.3571559!3d13.7020775!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2911bc6c91857%3A0xe1d1756da6aa85c6!2zTWVnYSBTcG9ydHMgR3JvdXAg4LmA4Lih4LiB4LiwIOC4quC4m-C4reC4o-C5jOC4lSDguIHguKPguLjguYrguJs!5e1!3m2!1sen!2sth!4v1734529028535!5m2!1sen!2sth"
            width="600"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
