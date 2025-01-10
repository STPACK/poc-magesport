/* eslint-disable @typescript-eslint/no-unused-expressions */
import { TaxManagementPageProps } from "./interface";
import dayjs from "dayjs";
import { useDebounce } from "use-debounce";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Button,
  message,
  Modal,
  Input,
  DatePicker,
  Table,
  TableColumnsType,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
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
  where,
  getCountFromServer,
  startAfter,
  limit,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import type { UploadFile } from "antd/es/upload/interface";

const { RangePicker } = DatePicker;

interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  createdAt: number;
}

export function TaxManagementPage({ className }: TaxManagementPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null);
  const [newOriginalName, setNewOriginalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, total: 0 });
  const [lastVisibleDocs, setLastVisibleDocs] = useState<Map<number, any>>(
    new Map()
  );

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500ms debounce

  const pageSize = 10;

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  const fetchTotalCount = async () => {
    try {
      let countQuery = query(
        collection(db, "pdfFiles"),
        where("originalName", ">=", searchTerm),
        where("originalName", "<=", searchTerm + "\uf8ff")
      );

      if (dateRange && dateRange[0] !== null && dateRange[1] !== null) {
        countQuery = query(
          countQuery,
          where("createdAt", ">=", dateRange[0].startOf("day").valueOf()),
          where("createdAt", "<=", dateRange[1].endOf("day").valueOf())
        );
      }

      const snapshot = await getCountFromServer(countQuery);
      return snapshot.data().count || 0;
    } catch (error) {
      console.error("Error fetching total count:", error);
      return 0;
    }
  };

  const fetchFiles = async (page: number) => {
    setLoading(true);
    try {
      const pageLimit = pageSize;
      let filesQuery = query(
        collection(db, "pdfFiles"),
        orderBy("createdAt", "desc"),
        where("originalName", ">=", searchTerm),
        where("originalName", "<=", searchTerm + "\uf8ff"),
        limit(pageLimit)
      );

      if (dateRange && dateRange[0] !== null && dateRange[1] !== null) {
        filesQuery = query(
          filesQuery,
          where("createdAt", ">=", dateRange[0].startOf("day").valueOf()),
          where("createdAt", "<=", dateRange[1].endOf("day").valueOf())
        );
      }

      // Use query cursors for pages after the first

      if (page > 1) {
        const lastDoc = lastVisibleDocs.get(page - 1);
        if (lastDoc) {
          filesQuery = query(filesQuery, startAfter(lastDoc));
        }
      }

      const querySnapshot = await getDocs(filesQuery);
      const files: UploadedFile[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UploadedFile, "id">),
      }));

      // Track the last visible document for the current page
      if (querySnapshot.docs.length > 0) {
        setLastVisibleDocs((prev) =>
          new Map(prev).set(
            page,
            querySnapshot.docs[querySnapshot.docs.length - 1]
          )
        );
      }

      setUploadedFiles(files);

      // Fetch total count only for the first page or when the search term changes
      if (page === 1) {
        const total = await fetchTotalCount();
        setPagination((prev) => ({ ...prev, total }));
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data on component mount or when searchTerm changes
  useEffect(() => {
    setLastVisibleDocs(new Map()); // Reset last visible docs when search changes
    fetchFiles(1);
  }, [debouncedSearchTerm, dateRange]);

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleUpload = async () => {
    setUploading(true);

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

        await addDoc(collection(db, "pdfFiles"), {
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

    setLastVisibleDocs(new Map()); // Reset last visible docs when search changes
    await fetchFiles(1);
    setSearchTerm("");
    setFileList([]);
    setUploading(false);
    setIsModalOpen(false);
  };

  const handleDelete = (file: UploadedFile) => {
    Modal.confirm({
      title: "Are you sure you want to delete this file?",
      content: `File: ${file.originalName}`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const fileRef = ref(storage, `pdfs/${file.name}`);
          await deleteObject(fileRef);

          const fileDocRef = doc(db, "pdfFiles", file.id);
          await deleteDoc(fileDocRef);

          await fetchFiles(pagination.current);
          message.success("File deleted successfully!");
        } catch (error) {
          console.error("Error deleting file:", error);
          message.error("Failed to delete file.");
        }
      },
    });
  };

  const openEditModal = (file: UploadedFile) => {
    setEditingFile(file);
    setNewOriginalName(file.originalName);
    setEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditingFile(null);
    setNewOriginalName("");
  };

  const handleEditSubmit = async () => {
    if (!editingFile) return;

    try {
      const fileDocRef = doc(db, "pdfFiles", editingFile.id);
      await updateDoc(fileDocRef, { originalName: newOriginalName });

      setUploadedFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === editingFile.id
            ? { ...file, originalName: newOriginalName }
            : file
        )
      );
      message.success("File name updated successfully!");
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating file name:", error);
      message.error("Failed to update file name.");
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    fetchFiles(pagination.current);
  };

  const columns: TableColumnsType<UploadedFile> = [
    {
      title: "File name",
      dataIndex: "originalName",
      key: "originalName",
    },
    {
      title: "Created date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (text: number) => dayjs(text).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Last download date",
      dataIndex: "downloadDates",
      key: "lastDownloadDate",
      width: 200,
      render: (dates: number[]) =>
        dates?.length > 0
          ? dayjs(dates[dates.length - 1]).format("DD-MM-YYYY HH:mm")
          : "-",
    },
    {
      title: "Download Count",
      dataIndex: "downloadDates",
      key: "downloadCount",
      width: 150,
      render: (dates: number[]) => dates?.length || "-",
    },
    {
      title: "",
      key: "actions",
      align: "right",
      width: 150,
      render: (_: any, file: UploadedFile) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(file)}
            style={{ marginRight: "8px" }}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(file)}
          ></Button>
        </div>
      ),
    },
  ];

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

      <Modal
        title="Edit file name"
        open={editModalOpen}
        onCancel={handleCancelEdit}
        onOk={handleEditSubmit}
        okText="Submit"
        cancelText="Cancel"
      >
        <Input
          size="large"
          placeholder="Enter new file name"
          value={newOriginalName}
          onChange={(e) => setNewOriginalName(e.target.value)}
          autoFocus
        />
      </Modal>

      <div style={{ marginBottom: "30px" }}>
        <Input
          size="large"
          placeholder="Search by Original Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "30%", marginRight: "10px" }}
        />
        <RangePicker size="large" onChange={(dates) => setDateRange(dates)} />
      </div>

      <Table
        columns={columns}
        dataSource={uploadedFiles}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pageSize,
          total: pagination.total,
          showSizeChanger: false,
          simple: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
