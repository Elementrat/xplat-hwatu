import React, { useRef } from "react";
import { IonIcon } from "@ionic/react";
import { imageOutline } from "ionicons/icons";
import styles from "./FileUploader.module.css";

const FileUploader = ({ onUploadComplete, cardID }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const onFileSelected = async (e) => {
    if (!inputFileRef?.current?.files) {
      return;
    }

    const file = inputFileRef.current.files[0];

    if (!file) {
      return;
    }

    const response = await fetch(`/api/img?filename=${file.name}`, {
      method: "POST",
      body: file
    });

    if (response?.body) {
      const resultJSON = await response.json();
      const fileUploadURL = resultJSON?.data?.uploadURL;
      if (onUploadComplete) {
        onUploadComplete(fileUploadURL);
      }
    }
  };

  const elementID = `${cardID}-file-upload`;

  return (
    <div>
      <label htmlFor={elementID} className={styles.fileUploadBtn}>
        <IonIcon icon={imageOutline} />
      </label>
      <input
        ref={inputFileRef}
        type="file"
        id={elementID}
        className={styles.fileUploadInput}
        onInput={onFileSelected}
      ></input>
    </div>
  );
};

export { FileUploader };
