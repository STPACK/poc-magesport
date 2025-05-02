// ImageEditorModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { Rnd } from 'react-rnd';

interface LinkArea {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  link: string;
}

interface Props {
  open: boolean;
  imageUrl?: string;
  linkAreas?: LinkArea[];
  onClose: () => void;
  onSave: (data: { imageUrl: string; linkAreas: LinkArea[] }) => void;
}

export const ImageEditorModal: React.FC<Props> = ({ open, imageUrl, linkAreas = [], onClose, onSave }) => {
  const [areas, setAreas] = useState<LinkArea[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAreas(linkAreas);
  }, [linkAreas]);

  const handleSave = () => {
    if (!imageUrl) return;
    setIsLoading(true);
    onSave({ imageUrl, linkAreas: areas });
    setIsLoading(false);
    onClose();
  };

  const handleAddArea = () => {
    const id = Date.now();
    setAreas((prev) => [
      ...prev,
      {
        id,
        x: 20,
        y: 20,
        width: 100,
        height: 60,
        link: '',
      },
    ]);
    setSelectedId(id);
  };

  const updateArea = (id: number, updates: Partial<LinkArea>) => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const removeArea = (id: number) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Edit Image Map"
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" loading={isLoading} onClick={handleSave}>Save</Button>,
      ]}
    >
      <Spin spinning={isLoading}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative', width: 600 }}>
            <img src={imageUrl} alt="edit" style={{ width: '100%' }} />
            {areas.map((area) => (
              <Rnd
                key={area.id}
                bounds="parent"
                size={{ width: area.width, height: area.height }}
                position={{ x: area.x, y: area.y }}
                onDragStop={(_, d) => updateArea(area.id, { x: d.x, y: d.y })}
                onResizeStop={(_, __, ref, ___, pos) => {
                  updateArea(area.id, {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: pos.x,
                    y: pos.y,
                  });
                }}
                style={{
                  border: area.id === selectedId ? '2px solid #1890ff' : '1px dashed gray',
                  backgroundColor: 'rgba(24,144,255,0.2)',
                }}
                onClick={() => setSelectedId(area.id)}
              />
            ))}
          </div>
          <div>
            <Button onClick={handleAddArea}>Add Link Area</Button>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginTop: 8 }}>
              {areas.map((area) => (
                <div
                  key={area.id}
                  style={{
                    border: area.id === selectedId ? '1px solid #1890ff' : '1px solid #ccc',
                    padding: 4,
                    marginBottom: 4,
                    background: '#f9f9f9',
                  }}
                  onClick={() => setSelectedId(area.id)}
                >
                  <input
                    placeholder="link"
                    value={area.link}
                    onChange={(e) => updateArea(area.id, { link: e.target.value })}
                    style={{ width: '80%' }}
                  />
                  <Button danger size="small" onClick={() => removeArea(area.id)} style={{ marginLeft: 4 }}>
                    x
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};


