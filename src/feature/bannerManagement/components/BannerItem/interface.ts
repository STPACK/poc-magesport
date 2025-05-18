import { BannerType } from "../../pages/BannerPage/interface";

export interface BannerItemProps {
  data: BannerType;
  moveItem: (index: number, direction: "up" | "down") => void;
  isLoading: boolean;
  handleRemoveActiveItem: (itemId: string) => void;
  order: number;
  disabledUp: boolean;
  disabledDown: boolean;
}
