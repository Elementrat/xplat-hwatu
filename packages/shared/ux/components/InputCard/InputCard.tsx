"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./InputCard.module.css";
import { useCurrentUserCards, createCard } from "xplat-lib";
import { clsx } from "clsx";
import { TextInput } from "../TextInput/TextInput";

const placeholder = "Enter text";

const KEY_CODES = {
  ENTER: 13
};

const ANIMATION_DURATION = 500;

const InputCard = () => {
  const [sideA, setSideA] = useState("");
  const [sideB, setCardTextSideB] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const aRef = useRef<HTMLInputElement>(null);
  const bRef = useRef<HTMLInputElement>(null);

  const { cards, mutate } = useCurrentUserCards();

  useEffect(() => {
    if (aRef?.current) {
      aRef?.current.focus();
    }
  }, [aRef.current]);

  const onInputChangeSideA = (e) => {
    setSideA(e.target.value);
  };

  const onInputChangeSideB = (e) => {
    setCardTextSideB(e.target.value);
  };

  const onKeyDownSideA = async (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      if (sideA) {
        bRef?.current?.focus();
      }
    }
  };

  const onKeyDownSideB = async (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      const createResult = await createCard(sideA, sideB);
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
        setSideA("");
        setCardTextSideB("");
        if (aRef?.current) {
          aRef.current.focus();
        }
      }
    }
  };

  const hasValidInput = sideA?.length > 0;

  const cardStyles = clsx({
    [styles.InputCard]: true,
    [styles.hasValidInput]: hasValidInput
  });

  const inputSideBStyles = clsx({
    [styles.textInput]: true,
    [styles.sideBInput]: true,
    [styles.show]: hasValidInput
  });

  return (
    <div className={cardStyles}>
      {submitted && <div className={styles.submitted} />}
      <TextInput
        ref={aRef}
        classNames={styles.textInput}
        placeholder={placeholder}
        onChange={onInputChangeSideA}
        onKeyDown={onKeyDownSideA}
        value={sideA}
      />
      <div className={styles.divider} />
      <TextInput
        ref={bRef}
        classNames={inputSideBStyles}
        placeholder={"(side b)"}
        value={sideB}
        onChange={onInputChangeSideB}
        onKeyDown={onKeyDownSideB}
      />
    </div>
  );
};

export { InputCard };
