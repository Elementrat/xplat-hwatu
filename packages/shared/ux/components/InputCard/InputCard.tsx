"use client";

import React, { useState } from "react";
import styles from "./InputCard.module.css";
import { useCurrentUserCards, createCard } from "xplat-lib";
import { clsx } from "clsx";

const placeholder = "Enter text";

const KEY_CODES = {
  ENTER: 13
};

const ANIMATION_DURATION = 400;

const InputCard = () => {
  const [cardText, setCardText] = useState("");
  const [cardTextSideB, setCardTextSideB] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { cards, mutate } = useCurrentUserCards();

  const onInputChange = (e) => {
    setCardText(e.target.value);
  };

  const onInputChangeSideB = (e) => {
    setCardTextSideB(e.target.value);
  };

  const onKeyDownSideB = async (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      const createResult = await createCard(cardText);
      const newCardAPI = createResult?.data?.card;
      if (newCardAPI) {
        const newCards = [...cards, newCardAPI];

        mutate(
          { cards: newCards },
          {
            throwOnError: true,
            revalidate: false
          }
        );

        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
        }, ANIMATION_DURATION);
        setCardText("");
      }
    }
  };

  const hasValidInput = cardText?.length > 0;

  const cardStyles = clsx({
    [styles.InputCard]: true,
    [styles.submitted]: submitted,
    [styles.hasValidInput]: hasValidInput
  });

  const inputSideBStyles = clsx({
    [styles.textInput]: true,
    [styles.sideBInput]: true,
    [styles.show]: hasValidInput
  });

  return (
    <div className={cardStyles}>
      <input
        className={styles.textInput}
        type="text"
        placeholder={placeholder}
        onChange={onInputChange}
        value={cardText}
      />
      <div className={styles.divider} />
      <input
        className={inputSideBStyles}
        type="text"
        placeholder={"(side b)"}
        value={cardTextSideB}
        onChange={onInputChangeSideB}
        onKeyDown={onKeyDownSideB}
      />
    </div>
  );
};

export { InputCard };
