import React from "react";
import Image from "next/image";
import { Button, Modal, Upload, Card, Spin } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { BannerManagementPageProps } from "./interface";
import { BannerModal } from "../../components/BannerModal";

export function BannerManagementPage({
  setConfirmingId,
  handleDelete,
  confirmingId,
  handleCancel,
  isModalOpen,
  updateBanner,
  setDataSelect,
  images,
  handleBeforeUpload,
  croppedImageUrl,
  createBanner,
  dataSelect,
  isLoading,
}: BannerManagementPageProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-[32px]">
        <p className="text-[32px] font-semibold">Banner Management</p>
        <ImgCrop
          aspect={6.5 / 3}
          quality={1}
          modalTitle="Crop Image"
          modalWidth={800}
        >
          <Upload
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button type="primary" size="large">
              Add banner
            </Button>
          </Upload>
        </ImgCrop>
      </div>
      {croppedImageUrl && (
        <BannerModal
          visible={isModalOpen}
          initialValues={{ imageUrl: croppedImageUrl, linkAreas: [] }}
          onSubmit={createBanner}
          onCancel={handleCancel}
        />
      )}
      {dataSelect && (
        <BannerModal
          visible={!!dataSelect}
          initialValues={{
            id: dataSelect.id,
            imageUrl: dataSelect.imageUrl,
            linkAreas: dataSelect.linkAreas,
          }}
          onSubmit={updateBanner}
          onCancel={() => setDataSelect(null)}
        />
      )}
      <div className="mt-[24px]">
        {isLoading ? (
          <div className="my-[50px] all-center">
            <Spin size="large" />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(423px, 1fr))",
              gap: 16,
            }}
          >
            {images.map((image) => (
              <Card
                key={image.id}
                hoverable
                className="relative w-full"
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => setDataSelect(image)}
                  />,
                  <Button
                    key="delete"
                    variant="text"
                    color="danger"
                    onClick={() => setConfirmingId(image.id)}
                  >
                    <DeleteOutlined />
                  </Button>,
                ]}
              >
                <div
                  className="relative w-full"
                  style={{
                    paddingTop: `${(3 / 6.5) * 100}%`,
                  }}
                >
                  <Image
                    src={image.imageUrl}
                    alt="with links"
                    className="absolute object-cover w-full h-full"
                    fill
                  />
                  {image.linkAreas.map((area) => (
                    <a
                      key={area.id}
                      href={area.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: "absolute",
                        top: `${area.y * 100}%`,
                        left: `${area.x * 100}%`,
                        width: `${area.width * 100}%`,
                        height: `${area.height * 100}%`,
                        border: "2px solid #1677ff",
                        boxSizing: "border-box",
                      }}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Modal
        open={!!confirmingId}
        title="ยืนยันการลบ"
        onOk={() => confirmingId && handleDelete(confirmingId)}
        onCancel={() => setConfirmingId(null)}
        okText="ลบ"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือไม่ว่าต้องการลบภาพนี้?</p>
      </Modal>
    </div>
  );
}
