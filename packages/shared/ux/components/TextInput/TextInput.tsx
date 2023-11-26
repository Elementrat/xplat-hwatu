"use client";

import React, { forwardRef, useState } from "react";
import styles from "./TextInput.module.css";
import { clsx } from "clsx";
import { IonIcon } from "@ionic/react";
import { closeOutline, createOutline } from "ionicons/icons";
import { Button } from "../Button/Button";

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
    editable,
    onSubmit,
    onClick,
    onClearClick,
    onEditClick,
    clearable,
    showEditBtn
  } = props;

  let controlledValue = value || "";
  const [textRowCount, setTextRowCount] = useState(
    controlledValue.split("\n").length || 1
  );


  const showControls = editable || clearable;

  const textAreaStyles = clsx(classNames, {
    [styles.TextInput]: true,
    [styles.showControls]: showControls
  })

  const controlsStyles = clsx({
    [styles.controls]: true,
    [styles.show]:showControls
  })
  
  /*
  useLayoutEffect(() => {
    setTextRowCount(controlledValue.split("\n").length);
  }, [value]);*/

  return (
    <div className={styles.TextInputContainer}>
      <textarea
        readOnly={!editable}
        rows={textRowCount}
        ref={ref}
        className={textAreaStyles}
        type="text"
        placeholder={placeholder}
        value={controlledValue}
        onClick={onClick}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onSubmit={onSubmit}
        onMouseOver={onMouseOver}
        id={inputID}
        name={inputID}
        disabled={disabled}
      />
      {(clearable || editable) && showEditBtn && 
      <div className={controlsStyles}>
          {editable && <Button
            icon={closeOutline}
            size="small"
            onClick={onClearClick}
          />}
          {
            !editable && <Button
            icon={createOutline}
            size="small"
            onClick={onEditClick}
          />
          }
      </div>}
    </div>
  );
});

export { TextInput };
