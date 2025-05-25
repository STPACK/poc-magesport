import { PartnerPageProps, PartnerType } from "./interface";
import React, { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";

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

export function withPartnerPage(Component: React.FC<PartnerPageProps>) {
  function WithPartnerPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [partner, setPartner] = useState<PartnerType[]>([]);
    const [editPartner, setEditPartner] = useState<PartnerType | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
      const fetchPartner = async () => {
        const querySnapshot = await getDocs(collection(db, "partners"));
        const partnerData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as PartnerType)
        );
        setPartner(partnerData);
      };
      fetchPartner();
    }, []);

    const showModal = (data?: PartnerType) => {
      setEditPartner(data || null);
      setIsModalOpen(true);
      if (data) {
        form.setFieldsValue({
          alt: data.alt,
          imageUrl: data.imageUrl,
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
      setEditPartner(null);
    };

    const handleFinish = async (values: {  alt: string }) => {
      setLoading(true);
      let finalImageUrl = editPartner?.imageUrl || "";

      if (imageFile) {
        const uniqueFilename = `${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, `partners/${uniqueFilename}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      try {
        if (editPartner) {
          const partnerRef = doc(db, "partners", editPartner.id);
          await updateDoc(partnerRef, {
            alt: values.alt,
            imageUrl: finalImageUrl,
          });
          setPartner((prev) =>
            prev.map((item) =>
              item.id === editPartner.id
                ? {
                    ...item,
                    alt: values.alt,
                    imageUrl: finalImageUrl,
                  }
                : item
            )
          );
          message.success("Partner updated successfully!");
        } else {
          const docRef = await addDoc(collection(db, "partners"), {
            alt: values.alt,
            imageUrl: finalImageUrl,
          });
          setPartner((prev) => [
            {
              id: docRef.id,
              alt: values.alt,
              imageUrl: finalImageUrl,
            },
            ...prev,
          ]);
          message.success("Partner created successfully!");
        }
        handleCancel();
      } catch (error) {
        message.error("Error saving partner.");
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
        form.setFieldsValue({ imageUrl: url });
      };
      reader.readAsDataURL(file);
    };

    const handleDelete = (id: string) => {
      Modal.confirm({
        title: "Confirm Delete",
        content: "Are you sure you want to delete this partner?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await deleteDoc(doc(db, "partners", id));
            setPartner((prev) => prev.filter((user) => user.id !== id));
            message.success("Partner deleted successfully!");
          } catch (error) {
            message.error("Error deleting partner.");
            console.error("Error:", error);
          }
        },
      });
    };
    const newProps = {
      form,
      setImageUrl,
      loading,
      partner,
      handleDelete,
      handleFinish,
      handleFileChange,
      imageUrl,
      showModal,
      editPartner,
      isModalOpen,
      handleCancel,
    };
    return <Component {...newProps} />;
  }
  return WithPartnerPage;
}
