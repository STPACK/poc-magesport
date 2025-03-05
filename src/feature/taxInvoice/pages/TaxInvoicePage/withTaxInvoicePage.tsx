import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

import { db } from "@/lib/firebase";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useQuery } from "@tanstack/react-query";
import { useQueryStrings } from "@/hooks/useQueryStrings";
import { TaxInvoicePageProps, UploadedFile } from "./interface";

export function withTaxInvoicePage(Component: React.FC<TaxInvoicePageProps>) {
  function WithTaxInvoicePage() {
    const [images, setImages] = useState<string[]>([]);
    const [current, setCurrent] = useState(0);
    const { getStringParam } = useGetQuery();
    const {
      searchObj: { invoiceId },
      updateQueryStrings,
    } = useQueryStrings({
      invoiceId: getStringParam("invoiceId"),
    });

    async function getFiles(): Promise<UploadedFile[]> {
      const filesCollection = collection(db, "pdfFiles");
      const filesQuery = query(
        filesCollection,
        where("originalName", "==", invoiceId)
      );
      const querySnapshot = await getDocs(filesQuery);

      // Filter results based on `originalName` containing the search term
      const results = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<UploadedFile, "id">),
        }))
        .filter((file) =>
          file.originalName.toLowerCase().includes(invoiceId.toLowerCase())
        );
      if (results[0]) {
        const dataSelect = results[0];
        await updateDownloadDates(dataSelect.id);
        renderPDFPages(dataSelect.url);
      }

      return results as UploadedFile[];
    }

    const renderPDFPages = async (pdfUrl: string) => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const totalPages = pdf.numPages; // Get total page count
        const imagesArray = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const scale = 2;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
          }
          imagesArray.push(canvas.toDataURL("image/png")); // Convert to PNG
        }

        setImages(imagesArray);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    const updateDownloadDates = async (id: string) => {
      try {
        const fileDocRef = doc(db, "pdfFiles", id);
        await updateDoc(fileDocRef, {
          downloadDates: arrayUnion(Date.now()),
        });
      } catch {
        message.error("Something went wrong. Please try again later.");
      }
    };

    const { data, isError, isLoading } = useQuery({
      queryKey: [invoiceId, "invoiceId"],
      queryFn: getFiles,
      enabled: !!invoiceId,
    });

    const onDownload = () => {
      const url = images[current];
      const suffix = url.slice(url.lastIndexOf("."));
      const filename = Date.now() + suffix;

      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    useEffect(() => {
      if (isError) {
        message.error("Something went wrong. Please try again later.");
      }
    }, [isError]);

    const newProps = {
      invoiceId,
      updateQueryStrings,
      isLoading,
      data,
      images,
      onDownload,
      setCurrent,
    };
    return <Component {...newProps} />;
  }
  return WithTaxInvoicePage;
}
