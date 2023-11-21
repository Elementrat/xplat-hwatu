"use client";

import React, { useContext, useEffect, useCallback } from "react";
import styles from "./StudyControls.module.css";
import { Button } from "../Button/Button";
import {
  chevronBack,
  chevronForward,
  refreshCircleOutline,
  closeOutline,
  checkmarkOutline
} from "ionicons/icons";
import { KEY_NAMES, UIContext } from "xplat-lib";
import { ProgressIndicator } from "../ProgressIndicator/ProgressIndicator";
import { useCurrentUserProfile } from "xplat-lib/client-api/user-profile";
import { CARD_PROGRESS } from "xplat-lib/models/UserProfile";

const StudyControls = () => {
  const {
    studyMode,
    studyModeMoveForwards,
    studyModeMoveBackwards,
    displayCards,
    updateCardProgress
  } = useContext(UIContext);

  const { userProfile } = useCurrentUserProfile();

  const onClickBack = () => {
    studyModeMoveBackwards();
  };

  const onClickForward = () => {
    studyModeMoveForwards();
  };

  const positiveProgress = () => {
    updateCardProgress(CARD_PROGRESS.POSITIVE);
  };

  const negativeProgress = () => {
    updateCardProgress(CARD_PROGRESS.NEGATIVE);
  };

  const handleKeyDown = useCallback(
    async (e) => {
      if (e.key === KEY_NAMES.ARROW_LEFT) {
        studyModeMoveBackwards();
      }
      if (e.key === KEY_NAMES.ARROW_RIGHT) {
        studyModeMoveForwards();
      }
      if (e.key === KEY_NAMES.ARROW_UP) {
        positiveProgress();
      }
      if (e.key === KEY_NAMES.ARROW_DOWN) {
        negativeProgress();
      }
    },
    [studyMode.index, displayCards]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.StudyControlsRoot}>
      {studyMode.active && (
        <ProgressIndicator
          items={displayCards}
          currentIndex={studyMode.index}
          progressStatuses={userProfile?.cardProgress}
        />
      )}

      <div className={styles.StudyControls}>
        <div className={styles.row}>
          <div className={styles.positiveBtn}>
            <Button
              icon={checkmarkOutline}
              onClick={positiveProgress}
              size="large"
            />
          </div>
        </div>
        <div className={styles.row}>
          <Button icon={chevronBack} onClick={onClickBack} size="large" />
          <div className={styles.Counts}>
            {studyMode.index + 1}/{displayCards?.length}
          </div>
          <Button icon={chevronForward} onClick={onClickForward} size="large" />
        </div>
        <div className={styles.row}>
          <div className={styles.negativeBtn}>
            <Button
              icon={closeOutline}
              onClick={negativeProgress}
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { StudyControls };
