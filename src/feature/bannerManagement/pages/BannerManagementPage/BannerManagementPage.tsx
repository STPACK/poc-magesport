import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  Upload,
  Row,
  Col,
  Space,
  Input,
  Tooltip,
  Spin,
} from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { Rnd } from "react-rnd";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { LinkAreaType } from "./interface";

const MAX_LINKS = 7;

export const BannerManagementPage: React.FC = () => {
  const [file, setFile] = useState<RcFile | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkAreas, setLinkAreas] = useState<LinkAreaType[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleBeforeUpload = (file: RcFile) => {
    setFile(file);
    setCroppedImageUrl(URL.createObjectURL(file));
    setIsModalOpen(true);
    return false;
  };

  const handleSave = async () => {
    if (!file || !croppedImageUrl) return;

    try {
      setIsLoading(true);

      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();

      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "imageMaps"), {
        imageUrl: downloadURL,
        linkAreas,
        createdAt: Timestamp.now(),
      });
      Modal.success({
        title: "บันทึกสำเร็จ",
        content: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
      });

      // reset
      setIsModalOpen(false);
      setLinkAreas([]);
      setSelectedAreaId(null);
      setFile(null);
      setCroppedImageUrl(null);
    } catch (err) {
      console.error(err);
      Modal.error({
        title: "เกิดข้อผิดพลาด",
        content: "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //   const handleSave = async () => {
  //     if (!file) return;

  //     try {
  //       const fileRef = ref(storage, `images/${file.name}-${Date.now()}`);
  //       const snapshot = await uploadBytes(fileRef, file);
  //       const downloadURL = await getDownloadURL(snapshot.ref);

  //       await addDoc(collection(firestore, 'imageLinks'), {
  //         imageUrl: downloadURL,
  //         linkAreas,
  //         createdAt: Timestamp.now(),
  //       });

  //       Modal.success({
  //         title: 'บันทึกสำเร็จ',
  //         content: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
  //       });

  //       setIsModalOpen(false);
  //       setFile(null);
  //       setLinkAreas([]);
  //       setSelectedAreaId(null);
  //     } catch (err) {
  //       console.error(err);
  //       Modal.error({
  //         title: 'เกิดข้อผิดพลาด',
  //         content: 'ไม่สามารถบันทึกข้อมูลได้',
  //       });
  //     }
  //   };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFile(null);
    setLinkAreas([]);
    setSelectedAreaId(null);
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
    <div style={{ padding: 24 }}>
      <ImgCrop aspect={6.5 / 3} quality={1} modalTitle="Crop Image">
        <Upload
          beforeUpload={handleBeforeUpload}
          showUploadList={false}
          listType="picture-card"
          accept="image/*"
        >
          {!file && <div>Add</div>}
        </Upload>
      </ImgCrop>

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
                cursor:
                  linkAreas.length < MAX_LINKS ? "pointer" : "not-allowed",
                userSelect: "none",
              }}
              onClick={handleAddLinkArea}
            >
              + เพิ่มจุดใส่ลิงก์({linkAreas.length}/{MAX_LINKS})
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
