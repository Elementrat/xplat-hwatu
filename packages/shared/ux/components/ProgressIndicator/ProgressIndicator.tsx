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

  const completionPercentage = (currentIndex / (numItems - 1)) * 100;

  return (
    <div className={styles.ProgressIndicator}>
      <div className={styles.ProgressBarContainer}>
        <div
          className={styles.ProgressBar}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      {items.map((item, index) => {
        const itemStyles = clsx({
          [styles.Item]: true,
          [styles.active]: currentIndex === index,
          [styles.itemComplete]: currentIndex > index
        });
        const percentage = (index / (numItems - 1)) * 100;

        return (
          <div
            className={itemStyles}
            key={`progress-item-${index}`}
            style={{
              left: `${percentage}%`
            }}
          />
        );
      })}
    </div>
  );
};

export { ProgressIndicator };
