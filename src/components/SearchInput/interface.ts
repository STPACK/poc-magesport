import { HTMLProps } from "react";

export interface WithSearchInputProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange" | "size"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  inputClassName?: string;
}

export interface SearchInputProps
  extends Omit<WithSearchInputProps, "onChange" | "onClear"> {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  onSearch: () => void;
}
