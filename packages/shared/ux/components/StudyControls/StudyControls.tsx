import React, { useContext } from "react";

import styles from "./StudyControls.module.css";
import { Button } from "../Button/Button";
import { chevronBack, chevronForward } from "ionicons/icons";
import { UIContext } from "xplat-lib";

const StudyControls = () => {
  const { studyMode, updateStudyModeIndex, displayCards } =
    useContext(UIContext);

  const onClickBack = () => {
    if (studyMode.index > 0) {
      updateStudyModeIndex(studyMode.index - 1);
    }
  };

  const onClickForward = () => {
    if (studyMode.index < displayCards.length - 1) {
      updateStudyModeIndex(studyMode.index + 1);
    }
  };
  return (
    <div className={styles.StudyControls}>
      <Button icon={chevronBack} onClick={onClickBack} primary={true} />
      <div className={styles.Counts}>
        {studyMode.index + 1}/{displayCards?.length}
      </div>
      <Button icon={chevronForward} onClick={onClickForward} primary={true} />
    </div>
  );
};

export { StudyControls };
