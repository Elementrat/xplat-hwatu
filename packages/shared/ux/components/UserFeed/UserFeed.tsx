"use client";

import React, { useContext } from "react";
import styles from "./UserFeed.module.css";
import { UIContext, useCurrentUserCards } from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";

const UserFeed = () => {
  const { cards } = useCurrentUserCards();
  const { searchText } = useContext(UIContext);

  let searchTextLowerCase = searchText?.toLowerCase();

  const cardsSortedNewestFirst =
    cards &&
    [...cards]?.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );

  let displayCards = cardsSortedNewestFirst;

  if (searchTextLowerCase && displayCards?.length) {
    displayCards = displayCards?.filter((card) => {
      const sideALowerCase = card?.title?.toLowerCase();
      const sideBLowerCase = card?.sideB?.toLowerCase();
      return (
        sideALowerCase?.includes(searchTextLowerCase) ||
        sideBLowerCase?.includes(searchTextLowerCase)
      );
    });
  }

  return (
    <div className={styles.UserFeed}>
      <InputCard />
      {displayCards?.map((card) => {
        return <InputCard cardID={card._id} key={card._id} />;
      })}
    </div>
  );
};

export { UserFeed };
