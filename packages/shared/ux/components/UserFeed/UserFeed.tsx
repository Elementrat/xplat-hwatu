"use client";

import React, { useContext } from "react";
import styles from "./UserFeed.module.css";
import { UIContext, filters, useCurrentUserCards } from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";
import { sorts } from "xplat-lib";

const UserFeed = () => {
  const { cards } = useCurrentUserCards();
  const { search } = useContext(UIContext);

  const cardsSortedNewestFirst = sorts.sortByCreatedDate(cards);
  const displayCards = filters.filterBySearchText(
    cardsSortedNewestFirst,
    search?.text
  );

  return (
    <div className={styles.UserFeed}>
      {Boolean(!search?.text?.length) && <InputCard />}
      {displayCards?.map((card) => {
        return <InputCard cardID={card._id} key={card._id} />;
      })}
    </div>
  );
};

export { UserFeed };
