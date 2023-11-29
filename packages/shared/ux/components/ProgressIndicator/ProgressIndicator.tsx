import React from "react";

import styles from "./ProgressIndicator.module.css";
import clsx from "clsx";
import mongoose from "mongoose";
import { getItemProgressStatuses } from "xplat-lib";

const ProgressIndicator = ({
  items,
  currentIndex,
  progressStatuses
}: {
  items: Array<any>;
  currentIndex: number;
  progressStatuses: Map<mongoose.Types.ObjectId, number>;
}) => {
  const completionPercentage = (currentIndex / (items?.length - 1)) * 100;

  return (
    <div className={styles.ProgressIndicator}>
      <div className={styles.ProgressBarContainer}>
        <div
          className={styles.ProgressBar}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      {items?.map((item, index) => {
        const percentage = (index / (items?.length - 1)) * 100;
        const { isNegativeProgress, hasProgress, isPositiveProgress } = getItemProgressStatuses(progressStatuses, item);

        const itemStyles = clsx({
          [styles.Item]: true,
          [styles.active]: currentIndex === index,
          [styles.itemComplete]: currentIndex > index,
          [styles.hasProgress]: hasProgress,
          [styles.negativeProgress]: isNegativeProgress,
          [styles.positiveProgress]: isPositiveProgress
        });

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
