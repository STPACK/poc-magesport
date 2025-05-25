import { FormInstance } from "antd";

export interface PartnerPageProps {
  showModal: (data?: PartnerType) => void;
  editPartner: PartnerType | null;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleFinish: (values: { alt: string }) => Promise<void>;
  handleFileChange: (file: File) => void;
  imageUrl: string | null;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  partner: PartnerType[];
  handleDelete: (id: string) => void;
  form: FormInstance<any>;
}

export interface PartnerType {
  id: string;
  alt: string;
  imageUrl: string;
}
