import React from "react";
import { Input, Modal } from "antd";

import { EditModalProps } from "./interface";

export function EditModal({ value, setValue, onCancel, onOk }: EditModalProps) {
  return (
    <Modal
      title="แก้ไขชื่อไฟล์"
      open
      onCancel={onCancel}
      onOk={onOk}
      okText="ตกลง"
      cancelText="ยกเลิก"
    >
      <Input
        size="large"
        placeholder="กรอกชื่อไฟล์ที่ต้องการ"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
    </Modal>
  );
}
