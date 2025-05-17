import React, { useState, useEffect } from "react";
import { message } from "antd";
import { RcFile } from "antd/es/upload";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { BannerFormType } from "../../components/BannerModal/interface";

import { BannerManagementPageProps, BannerType } from "./interface";

export function withBannerManagementPage(
  Component: React.FC<BannerManagementPageProps>
) {
  function WithBannerManagementPage() {
    const [file, setFile] = useState<RcFile | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [dataSelect, setDataSelect] = useState<BannerType | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleBeforeUpload = (file: RcFile) => {
      setFile(file);
      setCroppedImageUrl(URL.createObjectURL(file));
      setIsModalOpen(true);
      return false;
    };

    async function createBanner(values: BannerFormType) {
      if (!file || !values.imageUrl) return;

      try {
        setIsLoading(true);

        const response = await fetch(values.imageUrl);
        const blob = await response.blob();

        const storageRef = ref(
          storage,
          `bannerImage/${Date.now()}_${file.name}`
        );
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "banner"), {
          imageUrl: downloadURL,
          linkAreas: values.linkAreas,
          createdAt: Timestamp.now(),
        });
        message.success("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");

        // reset
        setFile(null);
        setCroppedImageUrl(null);
        setIsModalOpen(false);
        fetchImages();
      } catch (err) {
        console.error(err);
        message.error("เกิดข้อผิดพลาด-ไม่สามารถบันทึกข้อมูลได้");
      } finally {
        setIsLoading(false);
      }
    }
    async function updateBanner(values: BannerFormType) {
      if (!values.id) return;

      try {
        setIsLoading(true);

        await updateDoc(doc(db, "banner", values.id), {
          linkAreas: values.linkAreas,
        });
        message.success("อัปเดตเรียบร้อยแล้ว");

        setDataSelect(null);
        fetchImages();
      } catch (err) {
        console.error(err);
        message.error("เกิดข้อผิดพลาด-ไม่สามารถบันทึกข้อมูลได้");
      } finally {
        setIsLoading(false);
      }
    }

    const handleCancel = () => {
      setIsModalOpen(false);
      setFile(null);
      setCroppedImageUrl(null);
    };

    const [images, setImages] = useState<BannerType[]>([]);

    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const snapshot = await getDocs(collection(db, "banner"));
        const imageList: BannerType[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BannerType[];
        setImages(imageList);
      } catch {
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchImages();
    }, []);

    const handleDelete = async (id: string) => {
      await deleteDoc(doc(db, "banner", id));
      setImages(images.filter((img) => img.id !== id));
      setConfirmingId(null);
      message.success("ลบข้อมูลเรียบร้อยแล้ว");
    };
    const newProps: BannerManagementPageProps = {
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
    };
    return <Component {...newProps} />;
  }
  return WithBannerManagementPage;
}
