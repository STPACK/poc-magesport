import React from "react";
import Image from "next/image";
import {
  DownloadOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import {  Spin, Empty, Image as ImageAnt, Space } from "antd";

import { cn } from "@/lib/util";
import { SearchInput } from "@/components/SearchInput";
import { ContactUs } from "@/components/ContactUs";
import { TaxInvoicePageProps } from "./interface";
import Link from "next/link";

export function TaxInvoicePage({
  invoiceId,
  updateQueryStrings,
  isLoading,
  data,
  images,
  onDownload,
  setCurrent,
}: TaxInvoicePageProps) {
  return (
    <div
      className={cn(
        "text-black-2 max-w-[1024px] mx-auto desktop:px-0 px-[16px]"
      )}
    >
      <section className="mt-[56px] text-black-2 text-[14px]">
        <h1 className="text-[24px] font-bold mb-[16px]">ค้นหาใบกำกับภาษี</h1>
        <SearchInput
          placeholder="กรอกหมายเลขคำสั่งซื้อ"
          value={invoiceId}
          onChange={(value) => updateQueryStrings({ invoiceId: value.trim() })}
          className="mb-[18px]"
          disabled={isLoading}
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
      <div className="mt-[24px] w-full">
        {isLoading ? (
          <div className="all-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : invoiceId ? (
          data && data.length > 0 ? (
            <div className="grid grid-cols-1 shadow-lg rounded-lg bg-white desktop:px-[48px] px-[24px] desktop:py-[24px] py-[16px]  content-start">
              <h3 className="text-[18px]">
                หมายเลขคำสั่งซื้อ: <strong>{invoiceId}</strong>
              </h3>
              <div className="gird grid-cols-1 text-[14px] text-black-1 mt-[14px] divide-y">
                {data.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_100px] gap-[8px] py-[8px] items-center"
                  >
                    <div>{item.originalName}</div>
                    <Link
                      href={item.url}
                      className="underline text-primary"
                      target="_blank"
                    >
                      Download PDF
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="all-center h-[200px] shadow-lg rounded-lg bg-white">
              <Empty description="ไม่พบคำสั่งซื้อนี้" />
            </div>
          )
        ) : null}
      </div>
      {images.length > 0 && (
        <div className="mt-[24px] desktop:w-[600px] w-[300px] mx-auto shadow-lg">
          <ImageAnt.PreviewGroup
            items={images}
            preview={{
              toolbarRender: (
                _,
                {
                  transform: { scale },
                  actions: { onZoomOut, onZoomIn, onReset },
                }
              ) => (
                <Space size={20} className="toolbar-wrapper">
                  <DownloadOutlined onClick={onDownload} />
                  <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                  <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                  <UndoOutlined onClick={onReset} />
                </Space>
              ),
              onChange: (index) => {
                setCurrent(index);
              },
            }}
          >
            <ImageAnt width="auto" src={images[0]} />
          </ImageAnt.PreviewGroup>
        </div>
      )}
      <div className="my-[56px]">
        <h3 className=" text-[24px] font-bold text-center underline mb-[16px]">
          ตัวอย่างคำสั่งซื้อ
        </h3>
        <div className="grid desktop:grid-cols-3 grid-cols-1 gap-[16px]">
          <div className="relative w-full aspect-[150/30]">
            <Image src="/ex-tiktok.webp" alt="ex-tiktok" fill />
          </div>
          <div className="relative w-full aspect-[150/30]">
            <Image src="/ex-shopee.webp" alt="ex-shopee" fill />
          </div>
          <div className="relative w-full aspect-[150/30]">
            <Image src="/ex-lazada.webp" alt="ex-lazada" fill />
          </div>
        </div>
      </div>
      <ContactUs />
    </div>
  );
}
