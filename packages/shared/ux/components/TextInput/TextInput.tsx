import React, { forwardRef } from "react";

import styles from "./TextInput.module.css";
import { clsx } from "clsx";

const TextInput = forwardRef<HTMLInputElement>((props, ref) => {
  const { classNames, value, onChange, onKeyDown, 
    placeholder,inputID, onMouseOver, disabled} = props;

  let controlledValue = value || "";

  const styleClasses = clsx(classNames, styles.TextInput);

  const dataListID = `${inputID}-datalist`

  return (
    <input
      ref={ref}
      className={styleClasses}
      type="text"
      placeholder={placeholder}
      value={controlledValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onMouseOver={onMouseOver}
      id={inputID}
      name={inputID}
      list={dataListID}
      disabled={disabled}
    />
  );
});

export { TextInput };
