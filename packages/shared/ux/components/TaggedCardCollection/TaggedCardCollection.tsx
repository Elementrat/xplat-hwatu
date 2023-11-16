import React from "react";

import styles from "./TaggedCardCollection.module.css";
import { CardClass, TagClass } from "xplat-lib";
import clsx from "clsx";

const visibleCutoff = 10;

const collectionTitleStyles = clsx({
  "text-md": true,
  "font-bold": true,
  [styles.collectionTitle]: true
});

const TaggedCardCollection = ({
  tag,
  cards
}: {
  tag: TagClass;
  cards: Array<CardClass>;
}) => {
  return (
    <div className={styles.TaggedCardCollection}>
      <div className={collectionTitleStyles}>
        {tag?.title}
        {`(${cards?.length})`}
      </div>
      <div>
        {cards.map((card) => {
          let longString = card.title?.length > visibleCutoff;

          return (
            <div key={String(card._id)} className={styles.TaggedCard}>
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
  );
};

export { TaggedCardCollection };
