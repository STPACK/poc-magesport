import React from "react";
import { Card } from "antd";
import { BannerPageProps } from "./interface";
import Image from "next/image";

export function BannerPage({ images }: BannerPageProps) {
  return (
    <div style={{ padding: 24 }}>
      <h2>แสดงลิงก์บนภาพ</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: 16,
        }}
      >
        {images.map((image) => (
          <Card key={image.id} style={{ position: "relative" }}>
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
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
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
    </div>
  );
}
