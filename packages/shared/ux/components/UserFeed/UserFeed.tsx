"use client";

import React, { useContext } from "react";
import styles from "./UserFeed.module.css";
import { UIContext, filters, useCurrentUserCards } from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";
import { sorts } from "xplat-lib";

const UserFeed = () => {
  const { cards } = useCurrentUserCards();
  const { searchText } = useContext(UIContext);

  const cardsSortedNewestFirst = sorts.sortByCreatedDate(cards);
  const displayCards = filters.filterBySearchText(
    cardsSortedNewestFirst,
    searchText
  );

  return (
    <div className={styles.UserFeed}>
      {Boolean(!searchText?.length) && <InputCard />}
      {displayCards?.map((card) => {
        return <InputCard cardID={card._id} key={card._id} />;
      })}
    </div>
  );
};

export { UserFeed };
