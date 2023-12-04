"use client";
import React from "react";
import styles from "./UserCards.module.css";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { ErrorIndicator } from "../ErrorIndicator/ErrorIndicator";
import { useCurrentUserCards } from "xplat-lib/client-api/cards";
import STR from "../../strings/strings";


const UserCards = ({ cards }) => {
  const { cards: userCards, isLoading, isError } = useCurrentUserCards();

  const displayCards = cards || userCards;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorIndicator />;
  }

  return (
      <div className={styles.userCards}>
        {displayCards?.map((card) => {
          const cardKey = card?.title + "-" + card?._id;
          return (
            <div key={cardKey} id={cardKey} className={styles.userCard}>
              <div>{card?.title}</div>
              <div>{card?.sideB}</div>
            </div>
          );
        })}
    </div>
  );
};

export { UserCards };
