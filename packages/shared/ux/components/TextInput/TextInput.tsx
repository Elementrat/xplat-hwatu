"use client";

import React, { forwardRef, useState, useLayoutEffect } from "react";
import styles from "./TextInput.module.css";
import { clsx } from "clsx";
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
    showEditBtn,
    maxlength
  } = props;

  let controlledValue = value || "";
  const [textRowCount, setTextRowCount] = useState(
    controlledValue.split("\n").length || 1
  );

  const showControls = editable || clearable;

  const textAreaStyles = clsx(classNames, {
    [styles.TextInput]: true,
    [styles.showControls]: showControls
  });

  const controlsStyles = clsx({
    [styles.controls]: true,
    [styles.show]: showControls
  });


  function getTextareaNumberOfLines(textarea) {
    var previous_height = textarea.style.height, lines
    textarea.style.height = 0
    lines = parseInt(textarea.scrollHeight/parseInt(getComputedStyle(textarea).lineHeight) )
    textarea.style.height = previous_height
    return lines
}

  useLayoutEffect(() => {
    const lines = value?.length > 2 ? getTextareaNumberOfLines(ref.current) : 1;
    setTextRowCount(lines);
  }, [value]);

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
        maxLength={maxlength}
      />
      {(clearable || editable) && showEditBtn && (
        <div className={controlsStyles}>
          {editable && (
            <Button icon={closeOutline} size="small" onClick={onClearClick} />
          )}
          {!editable && (
            <Button icon={createOutline} size="small" onClick={onEditClick} />
          )}
        </div>
      )}
    </div>
  );
});

export { TextInput };
