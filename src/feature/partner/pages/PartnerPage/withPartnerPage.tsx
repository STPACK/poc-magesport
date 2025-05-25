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
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function withPartnerPage(Component: React.FC<PartnerPageProps>) {
  function WithPartnerPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [partner, setPartner] = useState<PartnerType[]>([]);
    const [editPartner, setEditPartner] = useState<PartnerType | null>(null);
    const [form] = Form.useForm();

    const fetchPartner = async () => {
      const querySnapshot = await getDocs(collection(db, "partners"));
      const partnerData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as PartnerType)
      );
      partnerData.sort((a, b) => a.order - b.order);
      setPartner(partnerData);
    };
    useEffect(() => {
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

    const handleFinish = async (values: PartnerType) => {
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
            order: editPartner.order,
            alt: values.alt,
            imageUrl: finalImageUrl,
          });
          message.success("Partner updated successfully!");
        } else {
          await addDoc(collection(db, "partners"), {
            alt: values.alt,
            imageUrl: finalImageUrl,
            order: partner[partner.length - 1]?.order + 1 || 1,
          });

          message.success("Partner created successfully!");
        }
        await fetchPartner();
        handleCancel();
      } catch (error) {
        message.error("Error saving partner.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
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
            await fetchPartner();
            message.success("Partner deleted successfully!");
          } catch (error) {
            message.error("Error deleting partner.");
            console.error("Error:", error);
          }
        },
      });
    };

    async function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = partner.findIndex((item) => item.id === active.id);
      const newIndex = partner.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(partner, oldIndex, newIndex);

      // รีเซ็ต order และอัปเดต Firestore
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index,
      }));
      setPartner(updatedItems);

      for (const item of updatedItems) {
        await updateDoc(doc(db, "partners", item.id), {
          order: item.order,
        });
      }
    }
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
      handleDragEnd,
    };
    return <Component {...newProps} />;
  }
  return WithPartnerPage;
}
