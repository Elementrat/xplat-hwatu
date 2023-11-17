import React from "react";

import styles from "./ProgressIndicator.module.css";
import clsx from "clsx";

const ProgressIndicator = ({
  numItems,
  currentIndex
}: {
  numItems: number;
  currentIndex: number;
}) => {
  const items = Array(numItems).fill(true);

  return (
    <div className={styles.ProgressIndicator}>
      {items.map((item, index) => {
        const itemStyles = clsx({
          [styles.Item]: true,
          [styles.active]: currentIndex === index
        });

        return <div className={itemStyles} />;
      })}
    </div>
  );
};

export { ProgressIndicator };
