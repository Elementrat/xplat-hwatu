"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import styles from "./InputCard.module.css";
import {
  useCurrentUserCards,
  createCard,
  deleteCard,
  updateCard,
  UIContext,
  updateTag,
  useCurrentUserTags,
  CardClass,
  TagClass,
  KEY_NAMES,
  CONSTANTS,
  url
} from "xplat-lib";
import { clsx } from "clsx";
import { TextInput } from "../TextInput/TextInput";
import { CardTags } from "../CardTags/CardTags";
import { trash, cloudUploadOutline, createOutline } from "ionicons/icons";
import { Button } from "../Button/Button";
import { CardSuggestions } from "../CardSuggestions/CardSuggestions";
import { KEY_CODES } from "xplat-lib";
import STR from "../../strings/strings";
import { fetchConfigs } from "xplat-lib/client-api/swr";
import { useSession } from "next-auth/react";
import { IonIcon } from "@ionic/react";
import { CARD_PROGRESS } from "xplat-lib/models/UserProfile";
import { FileUploader } from "../FileUploader/FileUploader";
import { CARD_ATTACHMENT_TYPES } from "xplat-lib/models/Card";
import { CardAttachmentRenderer } from "../CardAttachmentRenderer/CardAttachmentRenderer";

const ANIMATION_DURATION = 500;

const InputCard = ({
  cardID,
  progressMap
}: {
  cardID?: string;
  progressMap?: any;
}) => {
  const { cards, mutate: mutateCards } = useCurrentUserCards();
  const { tags, mutate: mutateTags } = useCurrentUserTags();
  const { status } = useSession();
  const {
    toggleLoginModal,
    searchTags,
    studyMode,
    studyModeMoveBackwards,
    studyModeMoveForwards,
    studyModeToggleObscure
  } = useContext(UIContext);

  let existingCard = cards?.find((card) => card?._id === cardID);

  const [sideA, setSideA] = useState(existingCard?.title);
  const [sideB, setCardTextSideB] = useState(existingCard?.sideB);
  const [lastUpdatedText, setLastUpdatedText] = useState("");
  const [edited, setEdited] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [itemProgress, setItemProgress] = useState(progressMap?.get(cardID));
  const [attachments, setAttachments] = useState(
    existingCard?.attachments || []
  );

  useEffect(() => {
    if (existingCard?.attachments) {
      setAttachments(existingCard.attachments);
    }
  }, [existingCard]);

  useEffect(() => {
    setItemProgress((prev) => {
      return progressMap?.get(cardID);
    });
  }, [progressMap]);

  const isNegativeProgress = itemProgress === CARD_PROGRESS.NEGATIVE;
  const isPositiveProgress = itemProgress === CARD_PROGRESS.POSITIVE;

  const handleKeyDown = (e) => {
    if (
      e.keyCode === KEY_CODES.CTRL_LEFT ||
      e.keyCode === KEY_CODES.CTRL_RIGHT ||
      e.key === KEY_NAMES.ARROW_UP ||
      e.key === KEY_NAMES.ARROW_DOWN
    ) {
      studyModeToggleObscure(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const aRef = useRef<HTMLInputElement>(null);
  const bRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aRef.current) {
      aRef.current.addEventListener("keydown", handleKeyDown);
    }
  }, [aRef]);

  const updateSideA = (text) => {
    setSideA(text);
    setLastUpdatedText(text);
    setEdited(true);
  };

  const updateSideB = (text) => {
    setCardTextSideB(text);
    setEdited(true);
  };

  const tryGetURLTitle = async (url) => {
    const res = await fetch(`/api/url?url=${url}`);
    const json = await res.json();
    return json?.title;
  };

  const onInputChangeSideA = async (e) => {
    const newValue = e?.target?.value;
    const isURL = url.isURL(newValue);

    if (isURL) {
      const pageTitle = await tryGetURLTitle(newValue);

      setAttachments([
        ...attachments,
        {
          type: CARD_ATTACHMENT_TYPES.LINK,
          title: pageTitle || "link",
          url: newValue
        }
      ]);
      updateSideA("");
      return;
    }
    updateSideA(newValue);
  };

  const onInputChangeSideB = async (e) => {
    const newValue = e?.target?.value;
    const isURL = url.isURL(newValue);

    if (isURL) {
      const pageTitle = await tryGetURLTitle(newValue);

      setAttachments([
        ...attachments,
        {
          type: CARD_ATTACHMENT_TYPES.LINK,
          title: pageTitle || "link",
          url: newValue
        }
      ]);
      updateSideB("");
      return;
    }
    updateSideB(newValue);
  };

  const applySearchTags = async (createdCard: CardClass) => {
    if (!searchTags.length) {
      return;
    }

    for (let searchTag of searchTags) {
      let existingTag = tags.find((tag) => tag.id === searchTag.id);

      if (existingTag) {
        let alreadyTagged = existingTag.cards.find(
          (e) => e === createdCard._id
        );
        if (!alreadyTagged) {
          const newCardListForTag = [...existingTag.cards, createdCard._id];

          const updateResult = await updateTag({
            _id: existingTag._id,
            cards: newCardListForTag
          });

          const updatedTag = updateResult?.data?.tag as TagClass | null;
          if (updatedTag) {
            const newTags = tags?.map((tag) => {
              return tag._id !== null && tag?._id === existingTag._id
                ? { ...tag, cards: newCardListForTag }
                : tag;
            });
            await mutateTags({ tags: newTags }, fetchConfigs.preservePrevious);
          }
        }
      }
    }
  };

  const onFileUpload = (fileURL) => {
    createOrUpdateCard(null, fileURL);
  };

  const createOrUpdateCard = async (dirtySideB?, fileURL?) => {
    let newOrUpdatedCard;
    const localSideB = dirtySideB || sideB;

    if (!cardID) {
      const createResult = await createCard(sideA, localSideB, attachments);
      newOrUpdatedCard = createResult?.data?.card;
      if (newOrUpdatedCard) {
        const newCards = [...cards, newOrUpdatedCard];
        mutateCards({ cards: newCards }, fetchConfigs.preservePrevious);
      }
      applySearchTags(newOrUpdatedCard);
    } else {
      let url = fileURL || imageURL;
      let newAttachments = attachments || [];

      if (fileURL || imageURL) {
        newAttachments = [
          ...attachments,
          {
            type: CARD_ATTACHMENT_TYPES.IMAGE,
            url
          } as ImageCardAttachment
        ];
      }

      const newCardData = {
        ...existingCard,
        title: sideA,
        sideB: localSideB,
        attachments: newAttachments
      };

      const createResult = await updateCard(newCardData);
      newOrUpdatedCard = createResult?.data?.card;
      if (newOrUpdatedCard) {
        const newCards = cards.map((card) => {
          return card?.id === cardID ? newCardData : card;
        });
        mutateCards({ cards: newCards }, fetchConfigs.preservePrevious);
      }
    }

    if (newOrUpdatedCard) {
      setLastUpdatedText("");
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, ANIMATION_DURATION);
      if (!cardID) {
        setSideA("");
        setCardTextSideB("");
        setAttachments([]);
        setEdited(false);
        if (aRef?.current) {
          aRef.current.focus();
        }
      } else {
        if (aRef?.current) {
          aRef?.current.blur();
        }
        if (bRef?.current) {
          bRef?.current.blur();
        }
        setEdited(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onKeyDownSideA({ keyCode: KEY_CODES.ENTER });
  };

  const onKeyDownSideA = async (e) => {
    if (e.shiftKey) {
      return;
    }
    if (e.keyCode === KEY_CODES.ENTER || e.code === KEY_CODES.ENTER) {
      e.preventDefault();
      e.stopPropagation();
      setEdited(true);
      if (existingCard) {
        createOrUpdateCard();
      } else {
        bRef?.current?.focus();
      }
    }
  };

  const onKeyDownSideB = async (e) => {
    if (e.shiftKey) {
      return;
    }
    if (e.keyCode === KEY_CODES.ENTER) {
      e.preventDefault();
      createOrUpdateCard();
    }
  };

  const onClickDelete = async () => {
    const newCards = cards?.filter((c) => c.id !== cardID);
    if (cardID) {
      await mutateCards({ cards: newCards }, fetchConfigs.preservePrevious);
      await deleteCard({ id: cardID });
    }
  };

  const onClickSuggestion = async (text) => {
    await updateSideB(text);
    createOrUpdateCard(text);
  };

  const onMouseOver = async () => {
    setHovered(true);
  };

  const onMouseOut = async () => {
    setHovered(false);
  };

  const onClickCreate = () => {
    createOrUpdateCard();
  };

  const onClick = async (e) => {
    if (status !== CONSTANTS.AUTHENTICATED) {
      toggleLoginModal();
    }

    if (studyMode.active) {
      const targetRect = e.target.getBoundingClientRect();
      const elementWidth = targetRect.width;
      const elementCenter = targetRect.x + elementWidth / 2;
      const x = e.pageX - elementCenter;

      if (x < 0) {
        studyModeMoveBackwards();
      }
      if (x > 0) {
        studyModeMoveForwards();
      }
    }
  };

  const onMouseOverSideB = () => {
    studyModeToggleObscure(false);
  };

  const hasValidInput = sideA?.length > 0;

  const cardStyles = clsx({
    [styles.InputCard]: true,
    [styles.hasValidInput]: hasValidInput && edited,
    [styles.hovered]: hovered,
    [styles.StudyMode]: studyMode.active,
    [styles.negativeProgress]: isNegativeProgress,
    [styles.positiveProgress]: isPositiveProgress
  });

  const inputSideBStyles = clsx({
    [styles.textInput]: true,
    [styles.sideBInput]: true,
    [styles.show]: hasValidInput,
    [styles.obscure]: studyMode.active && studyMode.obscure
  });

  const inputSideAStyles = clsx({
    [styles.textInput]: true,
    [styles.sideAInput]: true
  });

  const controlsDivider = clsx({
    [styles.divider]: true,
    [styles.controlsDivider]: true
  });

  const showModifiers = cardID || (!cardID && hasValidInput) || edited;

  const modifierStyles = clsx({
    [styles.cardModifiers]: true,
    [styles.show]: showModifiers
  });

  return (
    <div
      className={cardStyles}
      key={cardID}
      id={cardID}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      <div className={styles.progressLine} />

      {!cardID && (
        <div className={styles.newCardIndicator}>
          <IonIcon icon={createOutline} />
          {cards?.length === 0 ? STR.MAKE_FIRST_CARD : STR.NEW_CARD}
        </div>
      )}
      <div style={{ width: `100%` }}>
        <form onSubmit={handleSubmit} className={styles.textInputs}>
          <TextInput
            editable={true}
            ref={aRef}
            classNames={inputSideAStyles}
            placeholder={STR.ENTER_TEXT}
            onChange={onInputChangeSideA}
            onKeyDown={onKeyDownSideA}
            onSubmit={onKeyDownSideA}
            value={sideA}
            disabled={studyMode.active}
          />
          <div className={styles.divider} />
          <TextInput
            editable={true}
            ref={bRef}
            classNames={inputSideBStyles}
            placeholder={STR.SIDE_B}
            value={sideB}
            onChange={onInputChangeSideB}
            onKeyDown={onKeyDownSideB}
            onMouseOver={onMouseOverSideB}
            disabled={studyMode.active}
          />
        </form>
      </div>

      <CardAttachmentRenderer
        attachments={attachments}
        obscure={studyMode.active && studyMode.obscure}
      />

      {sideA && <div className={controlsDivider} />}

      <div className={modifierStyles}>
        <div className={styles.row}>
          <CardSuggestions
            inputText={lastUpdatedText}
            onClickSuggestion={onClickSuggestion}
          />
          {(edited || (!cardID && hasValidInput)) && (
            <Button
              icon={cloudUploadOutline}
              onClick={onClickCreate}
              primary={true}
              label="Save"
            />
          )}
        </div>
        <div className={styles.row}>
          {cardID && <CardTags cardID={cardID} />}

          {cardID && (
            <div className="flex">
              <FileUploader onUploadComplete={onFileUpload} cardID={cardID} />
              <Button icon={trash} onClick={onClickDelete} danger={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { InputCard };
