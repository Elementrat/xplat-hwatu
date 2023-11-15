"use client";

import React, { useContext } from "react";
import styles from "./UserFeed.module.css";
import {
  UIContext,
  filters,
  useCurrentUserCards,
  useCurrentUserTags
} from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";
import { sorts } from "xplat-lib";

const UserFeed = () => {
  const { cards } = useCurrentUserCards();
  const { tags } = useCurrentUserTags();
  const { searchText, searchTags } = useContext(UIContext);

  const cardsSortedNewestFirst = sorts.sortByCreatedDate(cards);

  let displayCards = filters.filterBySearchText(
    cardsSortedNewestFirst,
    searchText
  );

  const validSearchTags = tags.filter((tag) => {
    let matchingTag = searchTags.find((e) => e._id === tag.id);
    return Boolean(matchingTag);
  });

  displayCards = filters.filterCardsBySearchTags(displayCards, validSearchTags);

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
