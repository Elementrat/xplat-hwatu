import React from "react";

import styles from "./ProgressIndicator.module.css";
import clsx from "clsx";
import { CARD_PROGRESS } from "xplat-lib/models/UserProfile";
import mongoose from "mongoose";
import { CONSTANTS } from "xplat-lib";

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
      {items.map((item, index) => {
        const percentage = (index / (items?.length - 1)) * 100;
        const localMap = new Map(Object.entries(progressStatuses));
        const itemProgress = localMap.get(item._id);
        const hasProgress = typeof itemProgress !== CONSTANTS.UNDEFINED;

        const isNegativeProgress = itemProgress === CARD_PROGRESS.NEGATIVE;
        const isPositiveProgress = itemProgress === CARD_PROGRESS.POSITIVE;

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
