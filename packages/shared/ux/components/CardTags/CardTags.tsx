import React, { useState, useRef, useEffect } from "react";

import styles from "./CardTags.module.css";
import { Button } from "../Button/Button";
import { bookmarks } from "ionicons/icons";
import { TextInput } from "ux";
import { IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import { KEY_CODES } from "xplat-lib";

const CardTags = () => {
  const [showInput, setShowInput] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleShowInput = () => {
    setShowInput(!showInput);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  };

  const onInputChange = (e) => {
    if (e.target) {
      setTagInput(e.target.value);
    }
  };

  const onInputKeyDown = (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      console.log("__ENTER");
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className={styles.cardTags}>
      <Button icon={bookmarks} />
      {showInput ? (
        <TextInput
          placeholder={"New Tag"}
          ref={inputRef}
          value={tagInput}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
        />
      ) : (
        <Button icon={add} onClick={toggleShowInput} />
      )}
    </div>
  );
};

export { CardTags };
