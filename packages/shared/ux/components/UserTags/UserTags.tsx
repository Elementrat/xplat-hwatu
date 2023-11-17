"use client";
import React from "react";
import styles from "./UserTags.module.css";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { ErrorIndicator } from "../ErrorIndicator/ErrorIndicator";
import { useCurrentUserTags } from "xplat-lib/client-api/tags";
import STR from "../../strings/strings";
import { useCurrentUserCards, filters } from "xplat-lib";
import { TaggedCardCollection } from "../TaggedCardCollection/TaggedCardCollection";

const UserTags = () => {
  const { tags, isLoading, isError } = useCurrentUserTags();
  const { cards } = useCurrentUserCards();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorIndicator />;
  }

  const displayTags = filters.filterTagsWithCards(tags, cards);
  const untaggedCards = filters.untaggedCards(tags, cards);

  return (
    <div>
      <div className="flex align-items-center justify-content-space-between">
        <h2 className="text-lg font-bold">{STR.TAGS}</h2>
      </div>
      <div className={styles.UserTags}>
        {displayTags?.map((tag) => {
          const tagKey = tag?.title + "-" + tag?._id;
          let cardsForTag = filters.filterCardsBySearchTags(cards, [tag]);
          return (
            <TaggedCardCollection cards={cardsForTag} tag={tag} key={tagKey} />
          );
        })}
        <TaggedCardCollection
          cards={untaggedCards}
          tag={{ title: "untagged", _id: "untagged" }}
        />
      </div>
    </div>
  );
};

export { UserTags };
