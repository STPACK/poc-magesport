import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BannerPageProps, WithBannerPageProps, BannerType } from "./interface";

export function withBannerPage(Component: React.FC<BannerPageProps>) {
  function WithBannerPage(props: WithBannerPageProps) {
    const [images, setImages] = useState<BannerType[]>([]);

    useEffect(() => {
      const fetchImages = async () => {
        const snapshot = await getDocs(collection(db, "banner"));
        const imageList: BannerType[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BannerType[];
        setImages(imageList);
      };

      fetchImages();
    }, []);
    const newProps = {
      images,
      setImages,
      ...props,
    };
    return <Component {...newProps} />;
  }
  return WithBannerPage;
}
