import { RetailManagementPageProps } from "./interface";

// app/createUser/page.tsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Upload, Card, message, Image } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ImgCrop from "antd-img-crop";

const { Meta } = Card;

interface RetailDetailType {
  id: string;
  name: string;
  shopLink: string;
  imageUrl?: string;
}

export function RetailManagementPage({ className }: RetailManagementPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [retail, setRetail] = useState<RetailDetailType[]>([]);
  const [editRetail, setEditRetail] = useState<RetailDetailType | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "retail"));
      const retailData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as RetailDetailType)
      );
      setRetail(retailData);
    };
    fetchUsers();
  }, []);

  const showModal = (data?: RetailDetailType) => {
    setEditRetail(data || null);
    setIsModalOpen(true);
    if (data) {
      form.setFieldsValue({
        name: data.name,
        shopLink: data.shopLink,
        avatar: data.imageUrl,
      });
      setImageUrl(data.imageUrl || null);
    } else {
      form.resetFields();
      setImageUrl(null);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageFile(null);
    setImageUrl(null);
    setIsModalOpen(false);
    setEditRetail(null);
  };

  const handleFinish = async (values: { name: string; shopLink: string }) => {
    setLoading(true);
    let finalImageUrl = editRetail?.imageUrl || "";

    if (imageFile) {
      const uniqueFilename = `${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, `images/${uniqueFilename}`);
      await uploadBytes(storageRef, imageFile);
      finalImageUrl = await getDownloadURL(storageRef);
    }

    try {
      if (editRetail) {
        const userRef = doc(db, "retail", editRetail.id);
        await updateDoc(userRef, {
          name: values.name,
          shopLink: values.shopLink,
          imageUrl: finalImageUrl,
        });
        setRetail((prev) =>
          prev.map((user) =>
            user.id === editRetail.id
              ? {
                  ...user,
                  name: values.name,
                  shopLink: values.shopLink,
                  imageUrl: finalImageUrl,
                }
              : user
          )
        );
        message.success("Retail updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "retail"), {
          name: values.name,
          shopLink: values.shopLink,
          imageUrl: finalImageUrl,
        });
        setRetail((prev) => [
          {
            id: docRef.id,
            name: values.name,
            shopLink: values.shopLink,
            imageUrl: finalImageUrl,
          },
          ...prev,
        ]);
        message.success("Retail created successfully!");
      }
      handleCancel();
    } catch (error) {
      message.error("Error saving retail.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setImageUrl(url);
      form.setFieldsValue({ avatar: url });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this retail?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteDoc(doc(db, "retail", id));
          setRetail((prev) => prev.filter((user) => user.id !== id));
          message.success("Retail deleted successfully!");
        } catch (error) {
          message.error("Error deleting retail.");
          console.error("Error:", error);
        }
      },
    });
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-[32px]">
        <p className="text-[32px] font-semibold">Retail Store Management</p>
        <Button type="primary" onClick={() => showModal()} size="large">
          Add Retail Store
        </Button>
      </div>

      <Modal
        title={
          <p className="text-[24px] font-medium mb-[14px]">
            {editRetail ? "Edit Retail" : "Create New Retail"}
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
          initialValues={{ name: "", shopLink: "" }}
          className="flex flex-col"
        >
          <Form.Item
            className="w-[240px] !mx-auto"
            name="avatar" // Track this field for validation
            rules={[
              {
                required: true,
                message: "Please upload an image",
              },
            ]}
          >
            <ImgCrop aspect={3 / 4}>
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
                  <div className="flex w-[240px] aspect-[3/4] bg-gray-100 items-center justify-center border border-gray-300 border-dashed rounded-lg"></div>
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

          <Form.Item
            label="Retail Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the retail name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Retail Link"
            name="shopLink"
            rules={[
              { required: true, message: "Please enter the retail link" },
            ]}
          >
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

      <div
        className="rounded-lg"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          marginTop: "20px",
        }}
      >
        {retail.map((data) => (
          <Card
            key={data.id}
            hoverable
            style={{ width: 320 }}
            cover={
              data.imageUrl ? (
                <Image
                  alt={data.name}
                  src={data.imageUrl}
                  style={{
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : null
            }
            actions={[
              <EditOutlined key="edit" onClick={() => showModal(data)} />,
              <DeleteOutlined
                key="delete"
                onClick={() => handleDelete(data.id)}
              />,
            ]}
          >
            <Meta
              title={data.name}
              description={
                <a href={data.shopLink} target="_blank">
                  {data.shopLink}
                </a>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
