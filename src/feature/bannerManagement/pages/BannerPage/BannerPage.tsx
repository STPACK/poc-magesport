import React from "react";
import { Button, Empty, Modal, Spin } from "antd";
import { BannerPageProps } from "./interface";
import Image from "next/image";

import { cn } from "@/lib/util";
import Link from "next/link";
import { BannerItem } from "../../components/BannerItem";

export function BannerPage({
  isLoading,
  activeLinks,
  setIsModalOpen,
  moveItem,
  handleRemoveActiveItem,
  setActiveLinks,
  handleSave,
  isModalOpen,
  inactiveLinks,
  handleAddItem,
  originalLinks,
  isDirty,
}: BannerPageProps) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="text-[32px] font-semibold">Banner</div>
        <Button size="large" type="primary">
          <Link href="/admin-back-office/banner/management">จัดการ Banner</Link>
        </Button>
      </div>
      <div className="mt-[24px] grid grid-cols-[375px_375px] gap-[24px] mx-auto w-fit">
        <div className="w-[385px] space-y-4 shadow-md bg-white">
          <div
            className={cn(
              "flex px-[16px] py-[16px] items-center shadow-header "
            )}
          >
            <Image src="/logo.png" width={48} height={48} alt="logo" />
          </div>
          <div className="flex flex-col gap-[16px] h-[calc(100dvh-300px)] overflow-x-auto ">
            {isLoading ? (
              <div className="my-[42px] mx-auto">
                <Spin size="large" />
              </div>
            ) : activeLinks.length === 0 ? (
              <Empty
                description={
                  <span className="text-gray-2">
                    ไม่มี Banner ที่เปิดใช้งาน
                  </span>
                }
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-gray-2 underline cursor-pointer hover:text-blue-500 my-2"
                >
                  เพิ่มจาก Banner ที่ยังไม่เปิดใช้งาน
                </button>
                <p className="text-gray-2">&</p>
                <Link
                  href="/admin-back-office/banner/management"
                  className="underline"
                >
                  ไปหน้าจัดการเพื่อ สร้าง Banner ใหม่
                </Link>
              </Empty>
            ) : (
              activeLinks.map((item, index) => (
                <BannerItem
                  key={item.id}
                  data={item}
                  moveItem={moveItem}
                  isLoading={isLoading}
                  handleRemoveActiveItem={handleRemoveActiveItem}
                  order={index}
                  disabledUp={index === 0}
                  disabledDown={index === activeLinks.length - 1}
                />
              ))
            )}
          </div>
          <div className="flex justify-center py-[16px] text-black-2 bg-black-1/10 mt-[24px] ">
            <p>© 2024 Mega Sport Group. All rights reserved.</p>
          </div>
        </div>
        <div>
          <Button
            onClick={() => setIsModalOpen(true)}
            type="dashed"
            className="w-full"
            disabled={isLoading}
          >
            + เพิ่มจาก Banner ที่ยังไม่เปิดใช้งาน
          </Button>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              disabled={isLoading || !isDirty}
              size="large"
              onClick={() => setActiveLinks([...originalLinks])}
            >
              Reset
            </Button>
            <Button
              disabled={isLoading}
              size="large"
              type="primary"
              onClick={handleSave}
            >
              บันทึก
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="เลือก Banner ที่ไม่ active"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="grid grid-cols-2 gap-4">
          {inactiveLinks.length === 0 && (
            <div className="col-span-2 my-[24px]">
              <Empty
                description={
                  <span className="text-gray-2">
                    ไม่มี Banner ที่ไม่ active
                  </span>
                }
              >
                <Link
                  href="/admin-back-office/banner/management"
                  className="underline"
                >
                  ไปหน้าจัดการเพื่อ สร้าง Banner ใหม่
                </Link>
              </Empty>
            </div>
          )}
          {inactiveLinks.map((item) => (
            <div
              key={item.id}
              className="relative w-full border hover:border-blue-500 cursor-pointer"
              style={{
                paddingTop: `${(3 / 6.5) * 100}%`,
              }}
              onClick={() => handleAddItem(item)}
            >
              <Image
                src={item.imageUrl}
                alt="with-links"
                className="absolute object-cover w-full h-full"
                fill
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
