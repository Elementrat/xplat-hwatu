"use client";
import React from "react";

import styles from "./Modals.module.css";
import { useContext } from "react";
import { UIContext } from "xplat-lib";

const modalInnerID = "modal-inner";
const modalRootID = "modal-root";

const Modals = () => {
  const { modals, toggleLoginModal } = useContext(UIContext);

  const onClickModalInner = (e) => {
    if (e.target.id === modalInnerID) {
      toggleLoginModal();
    }
  };

  let showModal = modals?.login;

  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.ModalRoot} id={modalRootID}>
      <div
        className={styles.ModalInner}
        onClick={onClickModalInner}
        id={modalInnerID}
      >
        <div className={styles.ModalContent}></div>
      </div>
    </div>
  );
};

export { Modals };
