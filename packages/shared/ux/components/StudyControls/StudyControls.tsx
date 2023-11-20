"use client";

import React, { useContext, useEffect, useCallback } from "react";
import styles from "./StudyControls.module.css";
import { Button } from "../Button/Button";
import { chevronBack, chevronForward } from "ionicons/icons";
import { KEY_NAMES, UIContext } from "xplat-lib";
import GlobalSearch from "../GlobalSearch/GlobalSearch";
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

  const handleKeyDown = useCallback(
    async (e) => {
      if (e.key === KEY_NAMES.ARROW_LEFT) {
        studyModeMoveBackwards();
      }
      if (e.key === KEY_NAMES.ARROW_RIGHT) {
        studyModeMoveForwards();
      }
      if (e.key === KEY_NAMES.ARROW_UP) {
        updateCardProgress(CARD_PROGRESS.POSITIVE);
      }
      if (e.key === KEY_NAMES.ARROW_DOWN) {
        updateCardProgress(CARD_PROGRESS.NEGATIVE);
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
          progressStatuses={userProfile.cardProgress}
        />
      )}

      <div className={styles.StudyControls}>
        <Button icon={chevronBack} onClick={onClickBack} />
        <div className={styles.Counts}>
          {studyMode.index + 1}/{displayCards?.length}
        </div>
        <Button icon={chevronForward} onClick={onClickForward} />
      </div>
    </div>
  );
};

export { StudyControls };
