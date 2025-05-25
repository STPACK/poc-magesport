import { DragEndEvent } from "@dnd-kit/core";
import { FormInstance } from "antd";

export interface PartnerPageProps {
  editPartner: PartnerType | null;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleFinish: (values: PartnerType) => Promise<void>;
  handleFileChange: (file: File) => void;
  imageUrl: string | null;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  partner: PartnerType[];
  showModal: (data?: PartnerType) => void;
  handleDelete: (id: string) => void;
  form: FormInstance<any>;
  handleDragEnd: (event: DragEndEvent) => void;
}

export interface PartnerType {
  id: string;
  alt: string;
  imageUrl: string;
  order: number;
}
