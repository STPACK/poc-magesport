import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BannerPageProps, WithBannerPageProps, BannerType } from "./interface";
import { message } from "antd";

export function withBannerPage(Component: React.FC<BannerPageProps>) {
  function WithBannerPage(props: WithBannerPageProps) {
    const [activeLinks, setActiveLinks] = useState<BannerType[]>([]);
    const [inactiveLinks, setInactiveLinks] = useState<BannerType[]>([]);
    const [originalLinks, setOriginalLinks] = useState<BannerType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDirty, setIsDirty] = useState(false);

    const markDirty = () => setIsDirty(true);

    async function fetchData() {
      try {
        setIsLoading(true);
        const colRef = collection(db, "banner");

        const [activeSnap, inactiveSnap] = await Promise.all([
          getDocs(
            query(
              colRef,
              where("isActive", "==", true),
              orderBy("order", "asc")
            )
          ),
          getDocs(query(colRef, where("isActive", "==", false))),
        ]);

        const toItem = (docSnap: any) =>
          ({ id: docSnap.id, ...docSnap.data() } as BannerType);

        const active = activeSnap.docs.map(toItem);
        const inactive = inactiveSnap.docs.map(toItem);

        setActiveLinks(active);
        setOriginalLinks(active);
        setInactiveLinks(inactive);
        setIsDirty(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setIsLoading(false);
      }
    }
    
    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (isDirty) {
          e.preventDefault();
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [isDirty]);

    useEffect(() => {
      fetchData();
    }, []);

    const moveItem = (index: number, direction: "up" | "down") => {
      const newList = [...activeLinks];
      const swapIndex = direction === "up" ? index - 1 : index + 1;

      if (swapIndex < 0 || swapIndex >= newList.length) return;

      [newList[index], newList[swapIndex]] = [
        newList[swapIndex],
        newList[index],
      ];

      setActiveLinks(newList.map((item, i) => ({ ...item, order: i + 1 })));
      markDirty();
    };

    const handleAddItem = (item: BannerType) => {
      const updatedItem: BannerType = {
        ...item,
        isActive: true,
        order: activeLinks.length + 1,
      };

      setActiveLinks([...activeLinks, updatedItem]);
      setInactiveLinks(inactiveLinks.filter((i) => i.id !== item.id));
      setIsModalOpen(false);
      markDirty();
    };

    const handleRemoveActiveItem = (itemId: string) => {
      const item = activeLinks.find((i) => i.id === itemId);
      if (!item) return;

      setActiveLinks(
        activeLinks
          .filter((i) => i.id !== itemId)
          .map((item, i) => ({
            ...item,
            order: i + 1,
          }))
      );

      setInactiveLinks([
        ...inactiveLinks,
        { ...item, isActive: false, order: 0 },
      ]);
      markDirty();
    };

    const handleSave = async () => {
      try {
        const updates = activeLinks.map((item, index) =>
          updateDoc(doc(db, "banner", item.id), {
            isActive: true,
            order: index + 1,
          })
        );

        const resets = inactiveLinks.map((item) =>
          updateDoc(doc(db, "banner", item.id), {
            isActive: false,
            order: 0,
          })
        );

        await Promise.all([...updates, ...resets]);

        message.success("บันทึกเรียบร้อยแล้ว");
        fetchData();
      } catch (err) {
        console.error(err);
        message.error("เกิดข้อผิดพลาดในการบันทึก");
      }
    };

    const newProps = {
      handleAddItem,
      originalLinks,
      isLoading,
      activeLinks,
      setActiveLinks,
      handleSave,
      isModalOpen,
      inactiveLinks,
      setIsModalOpen,
      moveItem,
      handleRemoveActiveItem,
      isDirty,
      ...props,
    };
    return <Component {...newProps} />;
  }
  return WithBannerPage;
}
