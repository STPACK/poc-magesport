import { LinkAreaType } from "../../pages/BannerManagementPage/interface";

export interface WithBannerModalProps {
  visible: boolean;
  initialValues: BannerFormType;
  onSubmit: (values: BannerFormType) => Promise<void>;
  onCancel: () => void;
}
export interface BannerModalProps extends WithBannerModalProps {
  imgRef: React.RefObject<HTMLImageElement>;
  areaRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  getImageSize: () => {
    width: number;
    height: number;
  };
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  snapToAvailable: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    values: LinkAreaType[]
  ) => {
    x: number;
    y: number;
  } | null;
  selectedId: string | null;
  findEmptyPosition: (values: LinkAreaType[]) => {
    x: number;
    y: number;
  } | null;
}

export interface BannerFormType {
  id?: string;
  imageUrl: string;
  linkAreas: LinkAreaType[];
}
