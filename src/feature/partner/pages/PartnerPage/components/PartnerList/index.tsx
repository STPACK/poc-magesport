import React from "react";
import { Card } from "antd";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { PartnerListProps } from "./interface";
import Image from "next/image";
import { PartnerType } from "../../interface";

const SortableItem = ({
  id,
  data,
  showModal,
  handleDelete,
}: {
  id: UniqueIdentifier;
  data: PartnerType;
  showModal: (data?: PartnerType) => void;
  handleDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
    boxShadow: isDragging ? "0 8px 20px rgba(0,0,0,0.3)" : "none",
    borderRadius: 8,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className="w-full"
        hoverable
        styles={{ body: { display: "hidden", padding: "0" } }}
        cover={
          <div className="p-2" {...listeners}>
            <div className="relative w-full aspect-square">
              {data.imageUrl ? (
                <Image
                  alt={data.alt}
                  src={data.imageUrl}
                  fill
                  className="object-cover "
                />
              ) : null}
            </div>
          </div>
        }
        actions={[
          <EditOutlined key="edit" onClick={() => showModal(data)} />,
          <DeleteOutlined key="delete" onClick={() => handleDelete(data.id)} />,
        ]}
      ></Card>
    </div>
  );
};

export function PartnerList({
  handleDragEnd,
  partner,
  showModal,
  handleDelete,
}: PartnerListProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={partner.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="rounded-lg max-w-[1024px] gap-[16px] mx-auto grid grid-cols-6">
            {partner.map((data) => (
              <SortableItem
                id={data.id}
                key={data.id}
                data={data}
                showModal={showModal}
                handleDelete={handleDelete}
              ></SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
