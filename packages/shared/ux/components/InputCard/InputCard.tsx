"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import styles from "./InputCard.module.css";
import {
  useCurrentUserCards,
  createCard,
  deleteCard,
  updateCard
} from "xplat-lib";
import { clsx } from "clsx";
import { TextInput } from "../TextInput/TextInput";
import { CardTags } from "../CardTags/CardTags";
import { trash } from "ionicons/icons";
import { Button } from "../Button/Button";
import { CardSuggestions } from "../CardSuggestions/CardSuggestions";
import { KEY_CODES } from "xplat-lib";
import STR from "../../strings/strings";
import { fetchConfigs } from "xplat-lib/client-api/swr";

const ANIMATION_DURATION = 500;

const InputCard = ({ cardID }: { cardID?: string }) => {
  const { cards, mutate } = useCurrentUserCards();

  let existingCard = cards?.find((card) => card?._id === cardID);

  const [sideA, setSideA] = useState(existingCard?.title);
  const [sideB, setCardTextSideB] = useState(existingCard?.sideB);
  const [lastUpdatedText, setLastUpdatedText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [edited, setEdited] = useState(false);
  const [hovered, setHovered] = useState(false);

  const aRef = useRef<HTMLInputElement>(null);
  const bRef = useRef<HTMLInputElement>(null);

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

  const createOrUpdateCard = async (dirtySideB?) => {
    let newOrUpdatedCard;
    const localSideB = dirtySideB || sideB;

    if (!cardID) {
      const createResult = await createCard(sideA, localSideB);
      newOrUpdatedCard = createResult?.data?.card;
      if (newOrUpdatedCard) {
        const newCards = [...cards, newOrUpdatedCard];
        mutate(
          { cards: newCards },
          fetchConfigs.preservePrevious
        );
      }
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
        mutate(
          { cards: newCards },
          fetchConfigs.preservePrevious
        );
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

  const onKeyDownSideA = async (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
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
      await mutate({ cards: newCards }, fetchConfigs.preservePrevious);
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

  const hasValidInput = sideA?.length > 0;

  const cardStyles = clsx({
    [styles.InputCard]: true,
    [styles.hasValidInput]: hasValidInput && edited,
    [styles.hovered]: hovered
  });

  const inputSideBStyles = clsx({
    [styles.textInput]: true,
    [styles.sideBInput]: true,
    [styles.show]: hasValidInput
  });

  return (
    <div
      className={cardStyles}
      key={cardID}
      id={cardID}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {!cardID && <div className={styles.newCardIndicator}>{STR.NEW_CARD}</div>}
      <div className={styles.textInputs}>
        <TextInput
          ref={aRef}
          classNames={styles.textInput}
          placeholder={STR.ENTER_TEXT}
          onChange={onInputChangeSideA}
          onKeyDown={onKeyDownSideA}
          value={sideA}
        />
        <div className={styles.divider} />
        <TextInput
          ref={bRef}
          classNames={inputSideBStyles}
          placeholder={STR.SIDE_B}
          value={sideB}
          onChange={onInputChangeSideB}
          onKeyDown={onKeyDownSideB}
        />
      </div>
      {sideA && <div className={styles.divider} />}
      {sideA && (
        <CardSuggestions
          inputText={lastUpdatedText}
          onClickSuggestion={onClickSuggestion}
        />
      )}
      <div className={styles.cardModifiers}>
        {cardID && <CardTags cardID={cardID} />}

        {cardID && (
          <div>
            <Button icon={trash} onClick={onClickDelete} />
          </div>
        )}
      </div>
    </div>
  );
};

export { InputCard };
