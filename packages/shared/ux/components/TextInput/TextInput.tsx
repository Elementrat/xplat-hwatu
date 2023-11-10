import React, { forwardRef } from "react";

import styles from "./TextInput.module.css";
import { clsx } from "clsx";

const TextInput = forwardRef<HTMLInputElement>((props, ref) => {
  const { classNames, value, onChange, onKeyDown, placeholder } = props;

  const styleClasses = clsx(classNames, styles.TextInput);

  return (
    <input
      ref={ref}
      className={styleClasses}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
});

export { TextInput };
