"use client";

import React from "react";
import styles from "./UserFeed.module.css";
import { useCurrentUserCards } from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";

const UserFeed = () => {
  const { cards, isLoading } = useCurrentUserCards();

  const cardsSortedNewestFirst =
    cards &&
    [...cards]?.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );

  return (
    <div className={styles.UserFeed}>
      <InputCard />
      {isLoading && <LoadingIndicator />}
      {cardsSortedNewestFirst?.map((card) => {
        return <InputCard cardID={card._id} key={card._id} />;
      })}
    </div>
  );
};

export { UserFeed };
