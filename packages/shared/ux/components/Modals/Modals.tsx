"use client";
import React, { useEffect } from "react";

import styles from "./Modals.module.css";
import { useContext } from "react";
import { UIContext } from "xplat-lib";
import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../Button/Button";
import STR from "../../strings/strings";

const modalInnerID = "modal-inner";
const modalRootID = "modal-root";

const Modals = () => {
  const { modals, toggleLoginModal } = useContext(UIContext);
  const { status } = useSession();

  const onClickModalInner = (e) => {
    if (e.target.id === modalInnerID) {
      toggleLoginModal();
    }
  };

  let showModal = modals?.login;

  const modalRootStyles = clsx({
    [styles.ModalRoot]: true,
    [styles.show]: showModal
  });

  useEffect(() => {
    if (status === "authenticated" && modals?.login) {
      console.log("__TRY_HIDE")
      toggleLoginModal(false);
    }
  }, [status, modals?.login]);

  return (
    <div className={modalRootStyles} id={modalRootID}>
      <div
        className={styles.ModalInner}
        onClick={onClickModalInner}
        id={modalInnerID}
      >
        <div className={styles.ModalContent}>
          {modals?.login && <SignInModalContent />}
          <div className={styles.authStatus}>{status}</div>
        </div>
      </div>
    </div>
  );
};

const SignInModalContent = () => {
  return (
    <div className={styles.SignInModalContent}>
      <div className={styles.cta}>{STR.SIGN_IN_CTA}</div>
      <Button
        primary={true}
        onClick={() => {
          signIn();
        }}
        label={STR.SIGN_IN}
      />
    </div>
  );
};

export { Modals };
