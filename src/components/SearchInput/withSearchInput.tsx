import { ChangeEvent, useEffect, useState } from "react";

import { SearchInputProps, WithSearchInputProps } from "./interface";

export function withSearchInput(Component: React.FC<SearchInputProps>) {
  function WithSearchInput({
    value,
    onChange,
    onClear,
    ...props
  }: WithSearchInputProps) {
    const [searchText, setSearchText] = useState(value);

    useEffect(() => {
      if (searchText !== value) {
        setSearchText(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      setSearchText(event.target.value);
    }

    function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter") {
        e.preventDefault();
        onChange(searchText);
      }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    }

    function handleClear() {
      setSearchText("");
      if (onClear) {
        onClear();
      }
    }

    const componentProps: SearchInputProps = {
      ...props,
      value: searchText,
      handleChange,
      handleKeyUp,
      handleKeyDown,
      handleClear,
    };

    return <Component {...componentProps} />;
  }

  return WithSearchInput;
}
