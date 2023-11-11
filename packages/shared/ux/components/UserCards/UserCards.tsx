"use client";
import React from "react";
import styles from "./UserCards.module.css";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { ErrorIndicator } from "../ErrorIndicator/ErrorIndicator";
import {
  deleteAllCards,
  deleteCard,
  useCurrentUserCards
} from "xplat-lib/client-api/cards";
import { IonIcon } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { Button } from "../Button/Button";

const UserCards = () => {
  const { cards, isLoading, isError, mutate, isValidating } =
    useCurrentUserCards();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorIndicator />;
  }
  /*
  const onClickDeleteAll = async () => {
    await deleteAllCards();
    mutate(
      { cards: [] },
      {
        revalidate: true
      }
    );
  };*/

  return (
    <div>
      <div className="flex align-items-center justify-content-space-between">
        <h2 className="text-xl">Your Cards ({cards?.length})</h2>
      </div>
      <div className={styles.userCards}>
        {cards?.map((card) => {
          const cardKey = card?.title + "-" + card?._id;
          return (
            <div key={cardKey} id={cardKey} className={styles.userCard}>
              <div>{card?.title}</div>
              <div>{card?.sideB}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { UserCards };
