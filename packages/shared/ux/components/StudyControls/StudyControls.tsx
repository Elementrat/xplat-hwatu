"use client";

import React, { useContext, useEffect, useCallback, useState } from "react";
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
import clsx from "clsx";

const StudyControls = () => {
  const {
    studyMode,
    studyModeMoveForwards,
    studyModeMoveBackwards,
    displayCards,
    updateCardProgress
  } = useContext(UIContext);

  const { userProfile } = useCurrentUserProfile();

  const [keys, setKeys] = useState({
    left: false,
    down: false,
    up: false,
    right: false
  })

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
        setKeys({
          ...keys, 
          left: true
        })
      }
      if (e.key === KEY_NAMES.ARROW_RIGHT) {
        studyModeMoveForwards();
        setKeys({
          ...keys, 
          right: true
        })
      }
      if (e.key === KEY_NAMES.ARROW_UP) {
        positiveProgress();
        setKeys({
          ...keys, 
          up: true
        })
      }
      if (e.key === KEY_NAMES.ARROW_DOWN) {
        negativeProgress();
        setKeys({
          ...keys, 
          down: true
        })
      }
    },
    [studyMode.index, displayCards]
  );

  
  const handleKeyUp = useCallback(
    async (e) => {
      if (e.key === KEY_NAMES.ARROW_LEFT) {
        setKeys({
          ...keys, 
          left: false
        })
      }
      if (e.key === KEY_NAMES.ARROW_RIGHT) {
        setKeys({
          ...keys, 
          right: false
        })
      }
      if (e.key === KEY_NAMES.ARROW_UP) {
        setKeys({
          ...keys, 
          up: false
        })
      }
      if (e.key === KEY_NAMES.ARROW_DOWN) {
        setKeys({
          ...keys, 
          down: false
        })
      }
    },
    [studyMode.index, displayCards]
  );


  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp)

    };
  }, []);

  const leftBtnStyles = clsx({
    [styles.pressed]: keys.left
  })

  const rightBtnStyles = clsx({
    [styles.pressed]: keys.right
  })

  const upBtnStyles = clsx({
    [styles.pressed]: keys.up
  })

  const downBtnStyles = clsx({
    [styles.pressed]: keys.down
  })

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
            <div className={upBtnStyles}>
              <Button
                icon={checkmarkOutline}
                onClick={positiveProgress}
                size="large"
              />
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={leftBtnStyles}>
            <Button icon={chevronBack} onClick={onClickBack} size="large" />
          </div>
          <div className={styles.Counts}>
            {studyMode.index + 1}/{displayCards?.length}
          </div>
          <div className={rightBtnStyles}>
            <Button icon={chevronForward} onClick={onClickForward} size="large" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.negativeBtn}>
            <div className={downBtnStyles}>
              <Button
                icon={closeOutline}
                onClick={negativeProgress}
                size="large"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { StudyControls };
