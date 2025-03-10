import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useRef } from "react";

import { SearchInputProps } from "./interface";
import { cn } from "@/lib/util";

export function SearchInput({
  className,
  placeholder = "Search...",
  handleChange,
  handleKeyUp,
  handleKeyDown,
  handleClear,
  inputClassName,
  value,
  onSearch,
  ...props
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label
      className={cn(
        "rounded-[8px] shadow grid items-center gap-x-[8px] bg-white [&:has(input:focus)]:border-secondary-3 [&:has(input:focus)]:border border-white h-[64px] pl-[16px] grid-cols-[1fr_86px] relative",
        className
      )}
    >
      <input
        ref={inputRef}
        className={cn(
          "peer outline-none text-[18px] placeholder:text-gray-3 placeholder:text-[18px] focus:outline-none w-full",
          inputClassName
        )}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        {...props}
      />
      <button
        type="button"
        disabled={props.disabled}
        className="hidden text-secondary-3 peer-[:not(:placeholder-shown)]:block absolute right-[100px]"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.value = "";
            handleClear();
          }
        }}
      >
        <CloseCircleOutlined />
      </button>

      <button
        disabled={props.disabled}
        onClick={onSearch}
        className="bg-secondary-3 font-normal h-full rounded-r-[6px]"
      >
        <SearchOutlined style={{ fontSize: "24px", color: "#fff" }} />
      </button>
    </label>
  );
}
