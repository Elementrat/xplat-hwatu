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
  CONSTANTS
} from "xplat-lib";
import { clsx } from "clsx";
import { TextInput } from "../TextInput/TextInput";
import { CardTags } from "../CardTags/CardTags";
import { trash, cloudUploadOutline } from "ionicons/icons";
import { Button } from "../Button/Button";
import { CardSuggestions } from "../CardSuggestions/CardSuggestions";
import { KEY_CODES } from "xplat-lib";
import STR from "../../strings/strings";
import { fetchConfigs } from "xplat-lib/client-api/swr";
import { useSession } from "next-auth/react";
import { IonIcon } from "@ionic/react";

const ANIMATION_DURATION = 500;

const InputCard = ({ cardID }: { cardID?: string }) => {
  const { cards, mutate: mutateCards } = useCurrentUserCards();
  const { tags, mutate: mutateTags } = useCurrentUserTags();
  const { status } = useSession();
  const {
    toggleLoginModal,
    searchTags,
    studyMode,
    studyModeMoveBackwards,
    studyModeMoveForwards,
    displayCards
  } = useContext(UIContext);

  let existingCard = cards?.find((card) => card?._id === cardID);

  const [sideA, setSideA] = useState(existingCard?.title);
  const [sideB, setCardTextSideB] = useState(existingCard?.sideB);
  const [lastUpdatedText, setLastUpdatedText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [edited, setEdited] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [obscure, setObscure] = useState(studyMode.active);

  useEffect(() => {
    if (studyMode.active) {
      setObscure(true);
    } else {
      setObscure(false);
    }
  }, [studyMode]);

  const handleKeyDown = (e) => {
    console.log("__E", e)
    if (e.key === KEY_NAMES.ARROW_UP) {
      setObscure(false);
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
    if(aRef.current){
      aRef.current.addEventListener('keydown', handleKeyDown)
    }
  },[aRef])

  const updateSideA = (text) => {
    setSideA(text);
    setLastUpdatedText(text);
    setEdited(true);
  };

  const updateSideB = (text) => {
    setCardTextSideB(text);
    setEdited(true);
  };

  const onInputChangeSideA = (e) => {
    const newValue = e?.target?.value;
    updateSideA(newValue);
  };

  const onInputChangeSideB = (e) => {
    const newValue = e?.target?.value;
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

  const createOrUpdateCard = async (dirtySideB?) => {
    let newOrUpdatedCard;
    const localSideB = dirtySideB || sideB;

    if (!cardID) {
      const createResult = await createCard(sideA, localSideB);
      newOrUpdatedCard = createResult?.data?.card;
      if (newOrUpdatedCard) {
        const newCards = [...cards, newOrUpdatedCard];
        mutateCards({ cards: newCards }, fetchConfigs.preservePrevious);
      }
      applySearchTags(newOrUpdatedCard);
    } else {
      const createResult = await updateCard({
        ...existingCard,
        title: sideA,
        sideB: localSideB
      });
      newOrUpdatedCard = createResult?.data?.card;
      if (newOrUpdatedCard) {
        const newCards = cards.map((card) => {
          return card?.id === cardID
            ? { ...existingCard, title: sideA, sideB: localSideB }
            : card;
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
    onKeyDownSideA({keyCode: KEY_CODES.ENTER})
  }

  const onKeyDownSideA = async (e) => {
    if (e.keyCode === KEY_CODES.ENTER || e.code === KEY_CODES.ENTER) {
      setEdited(true);
      if (existingCard) {
        createOrUpdateCard();
      } else {
        bRef?.current?.focus();
      }
    }
  };

  const onKeyDownSideB = async (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
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
    setObscure(false);
  };

  const hasValidInput = sideA?.length > 0;

  const cardStyles = clsx({
    [styles.InputCard]: true,
    [styles.hasValidInput]: hasValidInput && edited,
    [styles.hovered]: hovered,
    [styles.StudyMode]: studyMode.active
  });

  const inputSideBStyles = clsx({
    [styles.textInput]: true,
    [styles.sideBInput]: true,
    [styles.show]: hasValidInput,
    [styles.obscure]: obscure
  });

  const controlsDivider = clsx({
    [styles.divider]: true,
    [styles.controlsDivider]: true
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
      {!cardID && (
        <div className={styles.newCardIndicator}>
          <IonIcon icon={cloudUploadOutline} />
          {cards?.length === 0 ? STR.MAKE_FIRST_CARD : STR.NEW_CARD}
        </div>
      )}
      <div>
        <form onSubmit={handleSubmit} className={styles.textInputs}>
          <TextInput
            ref={aRef}
            classNames={styles.textInput}
            placeholder={STR.ENTER_TEXT}
            onChange={onInputChangeSideA}
            onKeyDown={onKeyDownSideA}
            onSubmit={onKeyDownSideA}
            value={sideA}
            disabled={studyMode.active}
          />
        <div className={styles.divider} />
          <TextInput
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
      {sideA && <div className={controlsDivider} />}
      <CardSuggestions
        inputText={lastUpdatedText}
        onClickSuggestion={onClickSuggestion}
      />
      <div className={styles.cardModifiers}>
        {cardID && <CardTags cardID={cardID} />}

        {cardID && (
          <div>
            <Button icon={trash} onClick={onClickDelete} negative={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export { InputCard };
