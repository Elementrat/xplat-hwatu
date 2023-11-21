"use client";
import React, { useEffect } from "react";

import styles from "./Modals.module.css";
import { useContext } from "react";
import { CONSTANTS, UIContext, useCurrentUserTags } from "xplat-lib";
import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import { Button } from "../Button/Button";
import { closeOutline } from "ionicons/icons";
import { deleteTag } from "xplat-lib";
import { fetchConfigs } from "xplat-lib/client-api/swr";
import STR from "../../strings/strings";

const modalInnerID = "modal-inner";
const modalRootID = "modal-root";

const Modals = () => {
  const { modals, toggleLoginModal, closeAllModals } = useContext(UIContext);
  const { status } = useSession();

  const onClickModalInner = (e) => {
    if (e.target.id === modalInnerID) {
      closeAllModals();
    }
  };

  let showModal = modals?.login || modals?.deleteTag;

  const modalRootStyles = clsx({
    [styles.ModalRoot]: true,
    [styles.show]: showModal
  });

  useEffect(() => {
    if (status === CONSTANTS.AUTHENTICATED && modals?.login) {
      toggleLoginModal(false);
    }
  }, [status, modals?.login]);

  const onClickCloseModalBtn = () => {
    closeAllModals();
  };

  return (
    <div className={modalRootStyles} id={modalRootID}>
      <div
        className={styles.ModalInner}
        onClick={onClickModalInner}
        id={modalInnerID}
      >
        <div className={styles.ModalContent}>
          <div className={styles.closeModalBtn} onClick={onClickCloseModalBtn}>
            <Button icon={closeOutline} fillSpace={true} size="large" />
          </div>
          {modals?.login && <SignInModalContent status={status} />}
          {modals?.deleteTag && <DeleteTagModalContent />}
        </div>
      </div>
    </div>
  );
};

const DeleteTagModalContent = () => {
  const { tags, mutate: mutateTags } = useCurrentUserTags();
  const { searchTags, closeAllModals, updateSearchTags, displayCards } =
    useContext(UIContext);
  const selectedTag = searchTags[0];

  const onClickConfirmDeleteTag = async () => {
    if (selectedTag) {
      const newTags = tags?.filter((c) => c._id !== selectedTag._id);
      await mutateTags({ tags: newTags }, fetchConfigs.preservePrevious);
      await deleteTag({ id: selectedTag.id });
      await updateSearchTags([]);
      closeAllModals();
    }
  };

  return (
    <div className={styles.SignInModalContent}>
      <div className={styles.TitleLine}>
        <div className="font-bold text-xl">{STR.DELETE} Tag</div>
        <div
          className={styles.tag}
          style={{ border: `1px solid ${selectedTag?.color}` }}
        >
          {selectedTag.title}
        </div>
      </div>
      <div className={styles.cta}>
        {STR.DELETE_TAG_WARNING(displayCards?.length)}
      </div>
      <div className={styles.cta}>{STR.CONFIRM_PROCEED}</div>

      <Button
        danger={true}
        primary={true}
        onClick={onClickConfirmDeleteTag}
        label={STR.DELETE}
      />
    </div>
  );
};

const SignInModalContent = ({ status }) => {
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
      <div className={styles.authStatus}>{status}</div>
    </div>
  );
};

export { Modals };
