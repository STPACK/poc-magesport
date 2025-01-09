import { TaxInvoicePageProps } from "./interface";

// app/searchFiles/page.tsx
import React, { useState } from "react";
import { Input, List, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";

interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  createdAt: number;
}

export function TaxInvoicePage({ className }: TaxInvoicePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      message.warning("Please enter a search term.");
      return;
    }

    setLoading(true);
    try {
      // Query Firestore to find files where 'originalName' matches the search term
      const filesCollection = collection(db, "pdfFiles");
      const filesQuery = query(
        filesCollection,
        where("originalName", "==", searchTerm)
      );
      const querySnapshot = await getDocs(filesQuery);

      // Filter results based on `originalName` containing the search term
      const results = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<UploadedFile, "id">),
        }))
        .filter((file) =>
          file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
        );

      setSearchResults(results);
      setLoading(false);
    } catch (error) {
      console.error("Error searching files:", error);
      message.error("Failed to fetch search results.");
      setLoading(false);
    }
  };

  const handleDownload = async (file: UploadedFile) => {
    try {
      const fileDocRef = doc(db, "pdfFiles", file.id);
      await updateDoc(fileDocRef, {
        downloadDates: arrayUnion(Date.now()),
      });

      // Redirect to download the file
      window.open(file.url, "_blank");
    } catch (error) {
      console.error("Error logging download date:", error);
      message.error("Failed to log download date.");
    }
  };

  return (
    <div style={{ padding: "20px" }} className={className}>
      <h2>Search Files</h2>

      <Input
        placeholder="Enter file name to search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onPressEnter={handleSearch}
        suffix={
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            Search
          </Button>
        }
        style={{ width: "100%", marginBottom: 24 }}
      />

      <List
        header={<div>Search Results</div>}
        bordered
        dataSource={searchResults}
        renderItem={(file) => (
          <List.Item
            actions={[
              <Button
                key={file.id}
                type="link"
                onClick={() => handleDownload(file)}
              >
                View/Download
              </Button>,
            ]}
          >
            <a>{file.originalName}</a>
          </List.Item>
        )}
        loading={loading}
        locale={{ emptyText: "No files found" }}
      />
    </div>
  );
}
