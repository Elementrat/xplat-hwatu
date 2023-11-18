import React, { useState, useContext, useEffect } from "react";
import { UIContext } from "xplat-lib";
import styles from "./TaggedCardCollection.module.css";
import { CardClass, TagClass } from "xplat-lib";
import clsx from "clsx";

const visibleCutoff = 14;

const TaggedCardCollection = ({
  tag,
  cards
}: {
  tag: TagClass;
  cards: Array<CardClass>;
}) => {
  const { updateSearchText, updateSearchTags, searchTags } =
    useContext(UIContext);
  const expand = searchTags?.find((searchTag) => searchTag._id === tag._id);

  const tagColor = tag?.color || "rgba(0,0,0,.2)";

  const collectionStyles = clsx({
    [styles.expand]: expand,
    [styles.TaggedCardCollection]: true
  });

  const collectionTitleStyles = clsx({
    "text-md": true,
    "font-bold": true,
    [styles.collectionTitle]: true
  });

  const titleTextStyles = clsx({
    [styles.tagTitleText]: true,
    [styles.active]: expand
  });

  const toggleExpand = () => {
    let newExpandValue = !expand;
    if (!tag._id) {
      if (!searchTags.find((tag) => tag._id === "untagged")) {
        updateSearchTags([
          {
            _id: "untagged",
            title: "untagged"
          }
        ]);
        updateSearchText("");
      } else {
        updateSearchTags([]);
        updateSearchText("");
      }
      return;
    }
    if (newExpandValue) {
      updateSearchTags([tag]);
    } else {
      updateSearchTags([]);
    }
  };

  return (
    <div
      className={collectionStyles}
      style={{ borderLeft: `1px solid ${tagColor}` }}
    >
      <div className={collectionTitleStyles} onClick={toggleExpand}>
        <span className={titleTextStyles}>{tag?.title}</span>
        <span className={styles.cardCount}>{` (${cards?.length})`}</span>
      </div>
      <div>
        <div className={styles.cards}>
          {cards.map((card) => {
            const onCardClick = () => {
              updateSearchText(card.title);
            };

            let longString = card.title?.length > visibleCutoff;

            return (
              <div
                key={String(card._id)}
                className={styles.TaggedCard}
                onClick={onCardClick}
              >
                <div className={styles.cardSideA}>
                  {card.title?.slice(0, visibleCutoff)}
                  {longString && "..."}
                </div>
                <div className={styles.cardSideA}> {card.sideB}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { TaggedCardCollection };
