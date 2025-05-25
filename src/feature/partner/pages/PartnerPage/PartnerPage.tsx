import { PartnerPageProps } from "./interface";
import React from "react";
import { Modal, Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import ImgCrop from "antd-img-crop";
import { PartnerList } from "./components/PartnerList";

export function PartnerPage({
  showModal,
  editPartner,
  isModalOpen,
  handleCancel,
  handleFinish,
  handleFileChange,
  imageUrl,
  setImageUrl,
  loading,
  partner,
  handleDelete,
  form,
  handleDragEnd,
}: PartnerPageProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-[32px]">
        <p className="text-[32px] font-semibold">Partner List</p>
        <Button type="primary" onClick={() => showModal()} size="large">
          Add Partner
        </Button>
      </div>

      <Modal
        title={
          <p className="text-[24px] font-medium mb-[14px]">
            {editPartner ? "Edit Partner" : "Create New Partner"}
          </p>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ alt: "", imageUrl: "", order: partner.length + 1 }}
          className="flex flex-col"
        >
          <Form.Item
            className="w-[240px] !mx-auto"
            name="imageUrl" // Track this field for validation
            rules={[
              {
                required: true,
                message: "Please upload an image",
              },
            ]}
          >
            <ImgCrop aspect={1}>
              <Upload
                beforeUpload={(file) => {
                  handleFileChange(file);
                  return false; // Prevent automatic upload
                }}
                accept="image/*"
                showUploadList={false}
              >
                {imageUrl ? (
                  <img
                    alt="image-alt"
                    src={imageUrl || undefined}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                    onError={() => setImageUrl(null)} // Reset if image fails to load
                  />
                ) : (
                  <div className="flex w-[240px] aspect-square bg-gray-100 items-center justify-center border border-gray-300 border-dashed rounded-lg"></div>
                )}

                <Button
                  icon={<UploadOutlined />}
                  style={{ marginTop: "10px", width: "100%" }}
                >
                  Upload Image
                </Button>
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item label="Alt Text" name="alt">
            <Input />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button
              onClick={handleCancel}
              style={{ marginLeft: "auto", marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <PartnerList
        handleDragEnd={handleDragEnd}
        partner={partner}
        showModal={showModal}
        handleDelete={handleDelete}
      />
    </div>
  );
}
