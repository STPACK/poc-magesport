import { useState } from "react";

import { EditModalProps, WithEditModalProps } from "./interface";

export function withEditModal(Component: React.FC<EditModalProps>) {
  function WithEditModal({
    initialValue,
    onSubmit,
    ...props
  }: WithEditModalProps) {
    const [value, setValue] = useState(initialValue);

    async function onOk() {
      await onSubmit(value);
    }
    const newProps = {
      value,
      setValue,
      onOk,
      ...props,
    };
    return <Component {...newProps} />;
  }
  return WithEditModal;
}
