import React, { useState, useContext, useEffect } from "react";
import { CONSTANTS, UIContext } from "xplat-lib";
import styles from "./TaggedCardCollection.module.css";
import { CardClass, TagClass } from "xplat-lib";
import clsx from "clsx";
import { Button } from "../Button/Button";
import { trash } from "ionicons/icons";

const visibleCutoff = 14;

const TaggedCardCollection = ({
  tag,
  cards
}: {
  tag: TagClass;
  cards: Array<CardClass>;
}) => {
  const { updateSearchText, updateSearchTags, searchTags, studyMode, toggleDeleteTagModal } =
    useContext(UIContext);
  const expand = searchTags?.find((searchTag) => searchTag._id === tag._id);

  const tagColor = tag?.color || "rgba(0,0,0,.2)";

  const showTagControls = tag.title !== CONSTANTS.UNTAGGED;

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

  const tagControlStyles = clsx({
    [styles.tagControls]: true,
    [styles.active]: expand
  })

  const toggleExpand = () => {
    let newExpandValue = !expand;
    if (!tag._id) {
      if (!searchTags.find((tag) => tag._id === CONSTANTS.UNTAGGED)) {
        updateSearchTags([
          {
            _id:  CONSTANTS.UNTAGGED,
            title:  CONSTANTS.UNTAGGED
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

  const onTrashClick = () => {
    if(tag.title !== CONSTANTS.UNTAGGED){
    toggleDeleteTagModal();
    }
  }

  return (
    <div
      className={collectionStyles}
      style={{ borderLeft: `1px solid ${tagColor}` }}
    >
      <div className={collectionTitleStyles}>
        <div onClick={toggleExpand} className={styles.collectionTitleTextContainer}>
          <span className={titleTextStyles}>{tag?.title}</span>
          <span className={styles.cardCount}>{` (${cards?.length})`}</span>
        </div>
        {showTagControls && <div className={tagControlStyles}>
          <Button icon={trash} onClick={onTrashClick}/>
          </div>}
      </div>
      <div>
        <div className={styles.cards}>
          {cards.map((card) => {
            const onCardClick = () => {
              if (!studyMode.active) {
                updateSearchText(card.title);
              }
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
