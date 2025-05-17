import { LinkAreaType } from "../BannerManagementPage/interface";

export interface WithBannerPageProps {
  className?: string;
}

export interface BannerPageProps {
  className?: string;
  images: BannerType[];
  setImages: React.Dispatch<React.SetStateAction<BannerType[]>>;
}

export interface BannerType {
  id: string;
  imageUrl: string;
  linkAreas: LinkAreaType[];
}
