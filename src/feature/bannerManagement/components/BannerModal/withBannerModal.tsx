import React, { useEffect, useRef, useState } from "react";

import { BannerModalProps, WithBannerModalProps } from "./interface";
import { LinkAreaType } from "../../pages/BannerManagementPage/interface";

export function withBannerModal(Component: React.FC<BannerModalProps>) {
  function WithBannerModal({ initialValues, ...props }: WithBannerModalProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const areaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const getImageSize = () => {
      const width = imgRef.current?.offsetWidth || 1;
      const height = imgRef.current?.offsetHeight || 1;
      return { width, height };
    };

    const findEmptyPosition = (values: LinkAreaType[]) => {
      const { width, height } = getImageSize();
      const boxWidth = 100;
      const boxHeight = 60;
      const boxW = boxWidth / width;
      const boxH = boxHeight / height;

      for (let y = 0; y <= 1 - boxH; y += 0.05) {
        for (let x = 0; x <= 1 - boxW; x += 0.05) {
          const overlap = values.some((a) => {
            return !(
              x + boxW <= a.x ||
              x >= a.x + a.width ||
              y + boxH <= a.y ||
              y >= a.y + a.height
            );
          });
          if (!overlap) return { x: x, y: y };
        }
      }
      return null;
    };

    const snapToAvailable = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      values: LinkAreaType[]
    ) => {
      const { width: imgW, height: imgH } = getImageSize();
      const wP = width / imgW;
      const hP = height / imgH;

      for (let dy = 0; dy <= 0.2; dy += 0.01) {
        for (let dx = 0; dx <= 0.2; dx += 0.01) {
          const tryX = Math.min(Math.max((x + dx * imgW) / imgW, 0), 1 - wP);
          const tryY = Math.min(Math.max((y + dy * imgH) / imgH, 0), 1 - hP);

          const overlap = values.some((a) => {
            if (a.id === id) return false;
            return !(
              tryX + wP <= a.x ||
              tryX >= a.x + a.width ||
              tryY + hP <= a.y ||
              tryY >= a.y + a.height
            );
          });
          if (!overlap) return { x: tryX, y: tryY };
        }
      }
      return null;
    };

    useEffect(() => {
      if (imgRef.current) {
        setSelectedId(initialValues.linkAreas[0]?.id || null);
      }
    }, [imgRef, initialValues]);
    const newProps = {
      findEmptyPosition,
      snapToAvailable,
      selectedId,
      getImageSize,
      setSelectedId,
      imgRef,
      areaRefs,
      initialValues,
      ...props,
    };
    return <Component {...newProps} />;
  }
  return WithBannerModal;
}
