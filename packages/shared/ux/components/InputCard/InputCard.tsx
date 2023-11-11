"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./InputCard.module.css";
import { useCurrentUserCards, createCard, deleteCard, updateCard } from "xplat-lib";
import { clsx } from "clsx";
import { TextInput } from "../TextInput/TextInput";
import { CardTags } from "../CardTags/CardTags";
import { trashOutline } from "ionicons/icons";
import { Button } from "../Button/Button";

const placeholder = "Enter text";

const KEY_CODES = {
  ENTER: 13
};

const ANIMATION_DURATION = 500;

const InputCard = ({ cardID }: { cardID?: string }) => {
  const { cards, mutate } = useCurrentUserCards();

  let existingCard = cards?.find((card) => card?._id === cardID);

  const [sideA, setSideA] = useState(existingCard?.title);
  const [sideB, setCardTextSideB] = useState(existingCard?.sideB);
  const [submitted, setSubmitted] = useState(false);
  const [edited, setEdited] = useState(false);

  const aRef = useRef<HTMLInputElement>(null);
  const bRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aRef?.current && !cardID && !existingCard?.title) {
      aRef?.current.focus();
    }
  }, [aRef.current, cardID]);

  const onInputChangeSideA = (e) => {
    setSideA(e.target.value);
    setEdited(true);
  };

  const onInputChangeSideB = (e) => {
    setCardTextSideB(e.target.value);
    setEdited(true);
  };

  const onKeyDownSideA = async (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      if (sideA) {
        bRef?.current?.focus();
      }
      setEdited(true);
    }
  };

  const onKeyDownSideB = async (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      let newOrUpdatedCard;
    
      if(!cardID){
        const createResult = await createCard(sideA, sideB);
        newOrUpdatedCard = createResult?.data?.card;
        if (newOrUpdatedCard) {
          const newCards = [...cards, newOrUpdatedCard];
          mutate(
            { cards: newCards },
            {
              throwOnError: true,
              revalidate: false
            }
          );
        }
      }
      else{
        const createResult = await updateCard({ ...existingCard, title: sideA, sideB });
        newOrUpdatedCard = createResult?.data?.card;
        if(newOrUpdatedCard){
          const newCards = cards.map((card) => {
            return card?.id === cardID ? {...existingCard, title: sideA, sideB} : card
          })
          mutate(
            { cards: newCards },
            {
              throwOnError: true,
              revalidate: false
            }
          );
        }
      } 

      if(newOrUpdatedCard){
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
      }
      else{
        if(aRef?.current){
          aRef?.current.blur();
        }
        if(bRef?.current){
          bRef?.current.blur();
        }
        setEdited(false);
      }
    }
  };
}

  const onClickDelete = async () => {
    const newCards = cards?.filter((c) => c.id !== cardID);
    await deleteCard({ id: cardID });
    await mutate({ cards: newCards });
  };

  const hasValidInput = sideA?.length > 0;

  const cardStyles = clsx({
    [styles.InputCard]: true,
    [styles.hasValidInput]: hasValidInput && edited
  });

  const inputSideBStyles = clsx({
    [styles.textInput]: true,
    [styles.sideBInput]: true,
    [styles.show]: hasValidInput
  });

  return (
    <div className={cardStyles} key={cardID} id={cardID}>
      <div className={styles.textInputs}>
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
      {sideA && <div className={styles.divider} />}

      <div className={styles.cardModifiers}>
        <CardTags />

        {cardID && (
          <div>
            <Button icon={trashOutline} onClick={onClickDelete} />
          </div>
        )}
      </div>
    </div>
  );
};

export { InputCard };
