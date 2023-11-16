import React from "react";

import styles from "./TaggedCardCollection.module.css";
import { CardClass, TagClass } from "xplat-lib";

const TaggedCardCollection = ({
  tag,
  cards
}: {
  tag: TagClass;
  cards: Array<CardClass>;
}) => {
  return (
    <div className={styles.TaggedCardCollection}>
      <div className="text-sm font-bold">
        {tag?.title}
        {`(${cards?.length})`}
      </div>
      <div>
        {cards.map((card) => {
          return <div key={card.title}>{card.title}</div>;
        })}
      </div>
    </div>
  );
};

export { TaggedCardCollection };
