"use client";

import React, { useState } from "react";
import styles from "./InputCard.module.css";
import { useCurrentUserCards, createCard } from "xplat-lib";
import { clsx } from "clsx";

const placeholder = "new card";

const KEY_CODES = {
  ENTER: 13
};

const ANIMATION_DURATION = 400;

const InputCard = () => {
  const [cardText, setCardText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { cards, mutate } = useCurrentUserCards();

  const onInputChange = (e) => {
    setCardText(e.target.value);
  };

  const onKeyDown = async (e) => {
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

  const cardStyles = clsx({
    [styles.InputCard]: true,
    [styles.submitted]: submitted,
    [styles.hasValidInput]: cardText?.length > 0
  });

  return (
    <div className={cardStyles}>
      <input
        className={styles.textInput}
        type="text"
        placeholder={placeholder}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={cardText}
      />
    </div>
  );
};

export { InputCard };
