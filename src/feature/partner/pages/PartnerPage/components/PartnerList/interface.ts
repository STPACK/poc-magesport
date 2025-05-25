import { DragEndEvent } from "@dnd-kit/core";
import { PartnerType } from "../../interface";

export interface PartnerListProps {
  className?: string;
  handleDragEnd?(event: DragEndEvent): void;
  partner: PartnerType[];
  showModal: (data?: PartnerType) => void;
  handleDelete: (id: string) => void;
}
