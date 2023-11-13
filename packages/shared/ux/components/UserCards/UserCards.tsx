"use client";
import React from "react";
import styles from "./UserCards.module.css";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { ErrorIndicator } from "../ErrorIndicator/ErrorIndicator";
import { useCurrentUserCards } from "xplat-lib/client-api/cards";
import STR from "../../strings/strings";

const UserCards = () => {
  const { cards, isLoading, isError } = useCurrentUserCards();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorIndicator />;
  }

  return (
    <div>
      <div className="flex align-items-center justify-content-space-between">
        <h2 className="text-md font-bold">
          {STR.CARDS} ({cards?.length})
        </h2>
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
