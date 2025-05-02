import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { Card, Button, Row, Col, Modal, message } from "antd";
import { ImageEditorModal } from "./ImageEditorModal";

export const BannerList: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const handleEdit = (img: any) => {
    setEditData(img);
  };

  const handleUpdate = async ({
    imageUrl,
    linkAreas,
  }: {
    imageUrl: string;
    linkAreas: any[];
  }) => {
    if (!editData) return;
    await setDoc(doc(db, "imageMaps", editData.id), {
      imageUrl,
      linkAreas,
      updatedAt: Timestamp.now(),
    });
    message.success("Updated");
    fetchImages();
  };

  const fetchImages = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "imageMaps"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setImages(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Confirm delete?",
      onOk: async () => {
        await deleteDoc(doc(db, "imageMaps", id));
        message.success("Deleted");
        fetchImages();
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Image List</h2>
      <Row gutter={[16, 16]}>
        {images.map((img) => (
          <Col span={6} key={img.id}>
            <Card
              cover={
                <img
                  src={img.imageUrl}
                  alt="uploaded"
                  style={{ height: 140, objectFit: "cover" }}
                />
              }
              actions={[
                <Button key={`edit-${img.id}`} onClick={() => handleEdit(img)}>
                  Edit
                </Button>,
                <Button
                  key={`delete-${img.id}`}
                  danger
                  onClick={() => handleDelete(img.id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <p>{img.linkAreas?.length} areas</p>
            </Card>
          </Col>
        ))}
      </Row>
      <ImageEditorModal
        open={!!editData}
        imageUrl={editData?.imageUrl}
        linkAreas={editData?.linkAreas}
        onClose={() => setEditData(null)}
        onSave={handleUpdate}
      />
    </div>
  );
};
