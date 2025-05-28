import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import { BannerListProps } from "./interface";
import { cn } from "@/lib/util";
import { BannerType } from "@/feature/bannerManagement/pages/BannerManagementPage/interface";
import Image from "next/image";

export function BannerList({ className }: BannerListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState<BannerType[]>([]);
  async function fetchData() {
    try {
      setIsLoading(true);
      const colRef = collection(db, "banner");
      const activeSnap = await getDocs(
        query(colRef, where("isActive", "==", true), orderBy("order", "asc"))
      );
      const toItem = (docSnap: any) =>
        ({ id: docSnap.id, ...docSnap.data() } as BannerType);
      const active = activeSnap.docs.map(toItem);
      setBanners(active);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <section id="sales-channels" className={cn("grid grid-cols-1 gap-[16px] max-w-[1024px] mx-auto", className)}>
      {banners.map((image) => (
        <div key={image.id} style={{ position: "relative" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: `${(3 / 6.5) * 100}%`,
            }}
          >
            <Image
              src={image.imageUrl}
              alt="mega-sport-banner"
              className="object-cover"
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
                  boxSizing: "border-box",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
