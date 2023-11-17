"use client"

import React, { useContext, useEffect } from "react";

import styles from "./StudyControls.module.css";
import { Button } from "../Button/Button";
import { chevronBack, chevronForward } from "ionicons/icons";
import { KEY_NAMES, UIContext } from "xplat-lib";

const StudyControls = () => {
  const { studyMode, studyModeMoveForwards, studyModeMoveBackwards, displayCards } =
    useContext(UIContext);

  const onClickBack = () => {
    studyModeMoveBackwards()
  };

  const onClickForward = () => {
    studyModeMoveForwards();
  };

  const handleKeyDown = (e) => {
    if (e.key === KEY_NAMES.ARROW_LEFT) {
      studyModeMoveBackwards();
    }
    if(e.key === KEY_NAMES.ARROW_RIGHT){
      studyModeMoveForwards();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  },[])

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
