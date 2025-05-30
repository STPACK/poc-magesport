import { RcFile } from "antd/es/upload";
import { BannerFormType } from "../../components/BannerModal/interface";

export interface BannerManagementPageProps {
  handleBeforeUpload: (file: RcFile) => boolean;
  croppedImageUrl: string | null;
  createBanner: (values: BannerFormType) => Promise<void>;
  dataSelect: BannerType | null;
  updateBanner: (values: BannerFormType) => Promise<void>;
  setDataSelect: React.Dispatch<React.SetStateAction<BannerType | null>>;
  images: BannerType[];
  setConfirmingId: React.Dispatch<React.SetStateAction<string | null>>;
  handleDelete: (id: string) => Promise<void>;
  confirmingId: string | null;
  handleCancel: () => void;
  isModalOpen: boolean;
  isLoading: boolean;
}

export interface LinkAreaType {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  link: string;
}

export interface BannerType {
  id: string;
  imageUrl: string;
  linkAreas: LinkAreaType[];
  isActive: boolean;
}
