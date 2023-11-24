"use client"

import React, { forwardRef, useLayoutEffect, useState } from "react";

import styles from "./TextInput.module.css";
import { clsx } from "clsx";

const MIN_TEXTAREA_HEIGHT = 32;

const TextInput = forwardRef<HTMLInputElement>((props, ref) => {
  const {
    classNames,
    value,
    onChange,
    onKeyDown,
    placeholder,
    inputID,
    onMouseOver,
    disabled,
    onSubmit
  } = props;

  let controlledValue = value || "";
  const [textRowCount, setTextRowCount] = useState(controlledValue.split("\n").length || 1)

  const styleClasses = clsx(classNames, styles.TextInput);

  
  useLayoutEffect(() => {
    setTextRowCount(controlledValue.split("\n").length)
  })


  /*
  useEffect(() => {
   
  },[value])*/

  return (
    <textarea
      rows={textRowCount}
      ref={ref}
      className={styleClasses}
      type="text"
      placeholder={placeholder}
      value={controlledValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onSubmit={onSubmit}
      onMouseOver={onMouseOver}
      id={inputID}
      name={inputID}
      disabled={disabled}
    />
  );
});

export { TextInput };
