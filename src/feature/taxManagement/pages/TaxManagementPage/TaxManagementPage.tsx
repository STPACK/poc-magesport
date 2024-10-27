/* eslint-disable @typescript-eslint/no-unused-expressions */
import { TaxManagementPageProps } from "./interface";

import React, { useState, useEffect } from "react";
import { Upload, Button, message, List, Modal, Input, Pagination } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import type { UploadFile } from "antd/es/upload/interface";
import { dataFromMillis } from "@/lib/util";

interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  createdAt: number;
}

export function TaxManagementPage({ className }: TaxManagementPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 20;
  const maxFiles = 500;

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const filesQuery = query(
        collection(db, "pdfFiles"),
        orderBy("createdAt", "desc"),
        limit(maxFiles)
      );
      const querySnapshot = await getDocs(filesQuery);
      const files: UploadedFile[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UploadedFile, "id">),
      }));
      setUploadedFiles(files);
    };
    fetchFiles();
  }, []);

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setFileList(fileList);

  const handleUpload = async () => {
    setUploading(true);
    const uploadedFileData: UploadedFile[] = [];

    for (const file of fileList) {
      try {
        const originalName = file.name.replace(/\.pdf$/i, "");
        const uniqueFilename = `${Date.now()}_${originalName}`;
        const storageRef = ref(storage, `pdfs/${uniqueFilename}`);

        const snapshot = await uploadBytes(
          storageRef,
          file.originFileObj as File
        );
        const downloadURL = await getDownloadURL(snapshot.ref);

        const createdAt = Date.now();
        const docRef = await addDoc(collection(db, "pdfFiles"), {
          name: uniqueFilename,
          originalName,
          url: downloadURL,
          createdAt,
        });

        uploadedFileData.push({
          id: docRef.id,
          name: uniqueFilename,
          originalName,
          url: downloadURL,
          createdAt,
        });
        message.success(`Uploaded ${file.name} successfully!`);
      } catch (error) {
        message.error(`Failed to upload ${file.name}`);
        console.error("Error uploading file:", error);
      }
    }

    setUploadedFiles((prev) => [...uploadedFileData, ...prev]);
    setFileList([]);
    setUploading(false);
    setIsModalOpen(false);
  };

  const handleEdit = async (file: UploadedFile) => {
    const editingFileName = editingFile?.originalName.trim();
    if (
      !editingFile ||
      !editingFileName ||
      editingFileName === file.originalName
    ) {
      setEditingFile(null);
      return; // No update if name hasn't changed
    }
    try {
      const fileDocRef = doc(db, "pdfFiles", editingFile.id);
      await updateDoc(fileDocRef, { originalName: editingFileName });
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === editingFile.id ? { ...f, originalName: editingFileName } : f
        )
      );
      setEditingFile(null);
      message.success("File name updated successfully!");
    } catch (error) {
      console.error("Error updating file name:", error);
      message.error("Failed to update file name.");
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    try {
      const fileRef = ref(storage, `pdfs/${file.name}`);
      await deleteObject(fileRef);
      const fileDocRef = doc(db, "pdfFiles", file.id);
      await deleteDoc(fileDocRef);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
      message.success("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error("Failed to delete file.");
    }
  };

  const paginatedFiles = uploadedFiles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-[32px]">
        <p className="text-[32px] font-semibold">Tax Invoice Management</p>

        <Button type="primary" onClick={showModal} size="large">
          Upload Tax invoice
        </Button>
      </div>

      <Modal
        title="PDF Upload"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Upload.Dragger
          multiple
          beforeUpload={() => false}
          fileList={fileList}
          onChange={handleChange}
          accept=".pdf"
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            Drag and drop PDF files here or click to select
          </p>
        </Upload.Dragger>

        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0 || uploading}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? "Uploading..." : "Start Upload"}
        </Button>
      </Modal>

      <List
        header={<div>Tax Invoice Files</div>}
        bordered
        dataSource={paginatedFiles}
        renderItem={(file) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => setEditingFile(file)}
              />,
              <Button
                key="delete"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(file)}
              />,
            ]}
          >
            {editingFile && editingFile.id === file.id ? (
              <Input
                value={editingFile.originalName}
                autoFocus
                onChange={(e) =>
                  setEditingFile({
                    ...editingFile,
                    originalName: e.target.value,
                  })
                }
                onBlur={() => handleEdit(file)}
              />
            ) : (
              <div className="flex justify-between items-center w-full">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.originalName}
                </a>
                <div style={{ fontSize: "12px", color: "gray" }}>
                  {dataFromMillis(file.createdAt)}
                </div>
              </div>
            )}
          </List.Item>
        )}
        style={{ marginTop: 24 }}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={uploadedFiles.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: "center" }}
      />
    </div>
  );
}
