import { TaxInvoicePageProps } from "./interface";

import React, { useEffect } from "react";
import { Button, message, Spin, Empty } from "antd";

import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { SearchInput } from "@/components/SearchInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/util";
import { useQueryStrings } from "@/hooks/useQueryStrings";
import { useGetQuery } from "@/hooks/useGetQuery";
import { ContactUs } from "@/components/ContactUs";
import Image from "next/image";

interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  createdAt: number;
}

export function TaxInvoicePage({ className }: TaxInvoicePageProps) {
  const { getStringParam } = useGetQuery();

  const {
    searchObj: { invoiceId },
    updateQueryStrings,
  } = useQueryStrings({
    invoiceId: getStringParam("invoiceId"),
  });

  async function getFiles(): Promise<UploadedFile[]> {
    const filesCollection = collection(db, "pdfFiles");
    const filesQuery = query(
      filesCollection,
      where("originalName", "==", invoiceId)
    );
    const querySnapshot = await getDocs(filesQuery);

    // Filter results based on `originalName` containing the search term
    const results = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UploadedFile, "id">),
      }))
      .filter((file) =>
        file.originalName.toLowerCase().includes(invoiceId.toLowerCase())
      );

    return results as UploadedFile[];
  }

  const handleDownload = async (file: UploadedFile) => {
    try {
      const fileDocRef = doc(db, "pdfFiles", file.id);
      await updateDoc(fileDocRef, {
        downloadDates: arrayUnion(Date.now()),
      });

      // Redirect to download the file
      window.open(file.url, "_blank");
    } catch {
      message.error("Something went wrong. Please try again later.");
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: handleDownload,
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: [invoiceId, "invoiceId"],
    queryFn: getFiles,
    enabled: !!invoiceId,
  });

  useEffect(() => {
    if (isError) {
      message.error("Something went wrong. Please try again later.");
    }
  }, [isError]);

  return (
    <div
      className={cn(
        "text-black-2 max-w-[1024px] mx-auto desktop:px-0 px-[16px]",
        className
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
                    <Button
                      disabled={isPending}
                      className="underline"
                      type="link"
                      onClick={() => mutateAsync(item)}
                    >
                      Download
                    </Button>
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
