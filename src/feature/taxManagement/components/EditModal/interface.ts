export interface WithEditModalProps {
  onCancel: () => void;
  onSubmit: (value: string) => Promise<void>;
  initialValue: string;
}

export interface EditModalProps {
  value: string;
  setValue: (value: string) => void;
  onCancel: () => void;
  onOk: () => void;
}
