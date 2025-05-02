import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Space,
  Input,
  Tooltip,
  Spin,
} from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

import { Rnd } from "react-rnd";

import { BannerModalProps } from "./interface";
import { LinkAreaType } from "../../pages/BannerManagementPage/interface";

const MAX_LINKS = 7;

export function BannerModal({
  isModalOpen,
  handleCancel,
  handleSave,
  isLoading,
  croppedImageUrl,
}: BannerModalProps) {
  const [linkAreas, setLinkAreas] = useState<LinkAreaType[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const areaRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const getImageSize = () => {
    const width = imgRef.current?.offsetWidth || 1;
    const height = imgRef.current?.offsetHeight || 1;
    return { width, height };
  };

  const findEmptyPosition = () => {
    const { width, height } = getImageSize();
    const boxWidth = 100;
    const boxHeight = 60;
    const boxW = boxWidth / width;
    const boxH = boxHeight / height;

    for (let y = 0; y <= 1 - boxH; y += 0.05) {
      for (let x = 0; x <= 1 - boxW; x += 0.05) {
        const overlap = linkAreas.some((a) => {
          return !(
            x + boxW <= a.xPercent ||
            x >= a.xPercent + a.widthPercent ||
            y + boxH <= a.yPercent ||
            y >= a.yPercent + a.heightPercent
          );
        });
        if (!overlap) return { xPercent: x, yPercent: y };
      }
    }
    return { xPercent: 0, yPercent: 0 };
  };

  const handleAddLinkArea = () => {
    if (linkAreas.length >= MAX_LINKS) return;
    const { width, height } = getImageSize();
    const { xPercent, yPercent } = findEmptyPosition();

    setLinkAreas((prev) => [
      ...prev,
      {
        id: Date.now(),
        xPercent,
        yPercent,
        widthPercent: 100 / width,
        heightPercent: 60 / height,
        link: "",
      },
    ]);
  };

  const updateLinkArea = (id: number, data: Partial<LinkAreaType>) => {
    setLinkAreas((prev) =>
      prev.map((area) => (area.id === id ? { ...area, ...data } : area))
    );
  };

  const snapToAvailable = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const { width: imgW, height: imgH } = getImageSize();
    const wP = width / imgW;
    const hP = height / imgH;

    for (let dy = 0; dy <= 0.2; dy += 0.01) {
      for (let dx = 0; dx <= 0.2; dx += 0.01) {
        const tryX = Math.min(Math.max((x + dx * imgW) / imgW, 0), 1 - wP);
        const tryY = Math.min(Math.max((y + dy * imgH) / imgH, 0), 1 - hP);

        const overlap = linkAreas.some((a) => {
          if (a.id === id) return false;
          return !(
            tryX + wP <= a.xPercent ||
            tryX >= a.xPercent + a.widthPercent ||
            tryY + hP <= a.yPercent ||
            tryY >= a.yPercent + a.heightPercent
          );
        });
        if (!overlap) return { xPercent: tryX, yPercent: tryY };
      }
    }
    return null;
  };

  useEffect(() => {
    if (selectedAreaId && areaRefs.current[selectedAreaId]) {
      areaRefs.current[selectedAreaId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedAreaId]);

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
      width="80%"
      confirmLoading={isLoading}
      footer={(_, { OkBtn, CancelBtn }) => (
        <Space>
          <CancelBtn />
          <OkBtn />
        </Space>
      )}
    >
      <Spin spinning={isLoading} fullscreen></Spin>
      <Row gutter={24}>
        <Col span={16} style={{ position: "relative" }}>
          {croppedImageUrl && (
            <div style={{ position: "relative" }}>
              <img
                ref={imgRef}
                src={croppedImageUrl}
                alt="cropped"
                style={{ width: "100%", height: "auto" }}
                draggable={false}
              />
              {linkAreas.map((area) => {
                const { width, height } = getImageSize();
                return (
                  <Rnd
                    key={area.id}
                    size={{
                      width: area.widthPercent * width,
                      height: area.heightPercent * height,
                    }}
                    position={{
                      x: area.xPercent * width,
                      y: area.yPercent * height,
                    }}
                    onClick={() => setSelectedAreaId(area.id)}
                    onDragStop={(_, d) => {
                      const snap = snapToAvailable(
                        area.id,
                        d.x,
                        d.y,
                        area.widthPercent * width,
                        area.heightPercent * height
                      );
                      if (snap) updateLinkArea(area.id, snap);
                    }}
                    onResizeStop={(_, __, ref, ___, pos) => {
                      const newW = parseInt(ref.style.width);
                      const newH = parseInt(ref.style.height);
                      const snap = snapToAvailable(
                        area.id,
                        pos.x,
                        pos.y,
                        newW,
                        newH
                      );
                      if (snap)
                        updateLinkArea(area.id, {
                          ...snap,
                          widthPercent: newW / width,
                          heightPercent: newH / height,
                        });
                    }}
                    bounds="parent"
                    style={{
                      border: `2px dashed ${
                        selectedAreaId === area.id ? "#f5222d" : "#1890ff"
                      }`,
                      backgroundColor:
                        selectedAreaId === area.id
                          ? "rgba(245, 34, 45, 0.2)"
                          : "rgba(24, 144, 255, 0.1)",
                      zIndex: selectedAreaId === area.id ? 10 : 1,
                    }}
                  />
                );
              })}
            </div>
          )}
        </Col>

        <Col span={8} style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <h4 style={{ marginBottom: 12 }}>การจัดการจุดใส่ลิงก์</h4>
          {linkAreas.map((area) => (
            <div
              key={area.id}
              ref={(el) => (areaRefs.current[area.id] = el)}
              onClick={() => setSelectedAreaId(area.id)}
              style={{
                marginBottom: 8,
                padding: 8,
                border: `1px solid ${
                  selectedAreaId === area.id ? "#1890ff" : "#d9d9d9"
                }`,
                borderRadius: 6,
                backgroundColor:
                  selectedAreaId === area.id ? "#e6f7ff" : "#fff",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Input
                placeholder="เพิ่มลิงก์"
                value={area.link}
                onChange={(e) =>
                  updateLinkArea(area.id, { link: e.target.value })
                }
                style={{ flex: 1 }}
              />
              <Tooltip title="แสดง">
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => setSelectedAreaId(area.id)}
                />
              </Tooltip>
              <Tooltip title="ลบ">
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    setLinkAreas((prev) =>
                      prev.filter((a) => a.id !== area.id)
                    );
                  }}
                />
              </Tooltip>
            </div>
          ))}
          <div
            style={{
              border: "1px dashed #1890ff",
              borderRadius: 6,
              textAlign: "center",
              padding: "8px 12px",
              color: "#1890ff",
              cursor: linkAreas.length < MAX_LINKS ? "pointer" : "not-allowed",
              userSelect: "none",
            }}
            onClick={handleAddLinkArea}
          >
            + เพิ่มจุดใส่ลิงก์({linkAreas.length}/{MAX_LINKS})
          </div>
        </Col>
      </Row>
    </Modal>
  );
}
