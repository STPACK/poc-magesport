import { LinkAreaType } from "../BannerManagementPage/interface";

export interface WithBannerPageProps {
  className?: string;
}

export interface BannerPageProps {
  className?: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moveItem: (index: number, direction: "up" | "down") => void;
  handleRemoveActiveItem: (itemId: string) => void;
  setActiveLinks: React.Dispatch<React.SetStateAction<BannerType[]>>;
  handleSave: () => Promise<void>;
  isModalOpen: boolean;
  inactiveLinks: BannerType[];
  handleAddItem: (item: BannerType) => void;
  originalLinks: BannerType[];
  isLoading: boolean;
  isDirty: boolean;
  activeLinks: BannerType[];
}

export interface BannerType {
  id: string;
  imageUrl: string;
  linkAreas: LinkAreaType[];
  isActive: boolean;
  order: number;
}
