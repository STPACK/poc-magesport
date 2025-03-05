import React from "react";

export interface TaxInvoicePageProps {
  invoiceId: string;
  updateQueryStrings: (
    newParams: Partial<{
      invoiceId: string;
    }>
  ) => void;
  isLoading: boolean;
  data: UploadedFile[] | undefined;
  images: string[];
  onDownload: () => void;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  createdAt: number;
}
