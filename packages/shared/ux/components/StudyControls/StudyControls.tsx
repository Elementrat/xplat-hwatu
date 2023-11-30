"use client";

import React, { useContext, useEffect, useCallback, useState } from "react";
import styles from "./StudyControls.module.css";
import { Button } from "../Button/Button";
import {
  chevronBack,
  chevronForward,
  closeOutline,
  checkmarkOutline,
  invertModeOutline
} from "ionicons/icons";
import {  CardClass, KEY_NAMES, UIContext, getItemProgressStatuses, shuffleArray } from "xplat-lib";
import { ProgressIndicator } from "../ProgressIndicator/ProgressIndicator";
import { useCurrentUserProfile } from "xplat-lib/client-api/user-profile";
import { CARD_PROGRESS } from "xplat-lib/models/UserProfile";
import clsx from "clsx";
import { StudyModeSummary } from "../StudyModeSummary/StudyModeSummary";


interface AnswerCardWithClickStatus extends CardClass{
  clickedWrong: boolean,
  clickedCorrect: boolean
}

const StudyControls = ({progressMap}) => {
  const {
    studyMode,
    studyModeMoveForwards,
    studyModeMoveBackwards,
    updateCardProgress,
    studyModeToggleObscure,
    displayCards
  } = useContext(UIContext);

  const [answers, setAnswers] = useState<Array<AnswerCardWithClickStatus>>([]);
  const [hasGuessed, setHasGuessed] = useState(false);
  const { userProfile } = useCurrentUserProfile();

  const currentItem = studyMode?.cards?.[studyMode.index];

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

  const onClickToggleObscure = () => {
    studyModeToggleObscure();
  }

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
    [studyMode.index, studyMode.cards, currentItem]
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
    [studyMode.index, studyMode.cards]
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

  const inverterBtnStyles = clsx({
    [styles.Inverter]: true,
    [styles.Inverted]: studyMode.obscure,
    [styles.Missing]: Boolean(!currentItem?.sideB)
  })

  const { isNegativeProgress,  isPositiveProgress } = getItemProgressStatuses(userProfile?.cardProgress, currentItem);

  const upBtnStyles = clsx({
    [styles.positive]: true,
    [styles.progressBtn]: true,
    [styles.pressed]: keys.up,
    [styles.active]: isPositiveProgress,
  })

  const downBtnStyles = clsx({
    [styles.negative]: true,
    [styles.progressBtn]: true,
    [styles.pressed]: keys.down,
    [styles.active]: isNegativeProgress
  })

  const onClickAnswer = (clickedAnswer: AnswerCardWithClickStatus) => {
    let clickedCorrect = clickedAnswer?._id === currentItem?._id;
    let clickedWrong = clickedAnswer?._id !== currentItem?._id;

    let newAnswers = answers.map((answer) => {
      if(answer._id === clickedAnswer._id){
        return {
          ...answer,
          clickedCorrect, 
          clickedWrong
        }
      }
      else{
        return answer;
      }
    })

    if(!hasGuessed){
      if(clickedWrong){
        negativeProgress();
      }
      if(clickedCorrect){
        positiveProgress();
      }
    }

    setAnswers(newAnswers)
    setHasGuessed(true);
  }


  useEffect(() => {
    if(!currentItem?.sideB){
      setAnswers([])
      return;
    }
    const cardsWithAnswer = displayCards?.filter((e) => Boolean(e?.sideB) && e._id !== currentItem._id);
    let answers:Array<any> = [];
    let numIndicesToSelect = cardsWithAnswer?.length > 4 ? 3 : cardsWithAnswer?.length - 1;
    let answerPool = cardsWithAnswer?.slice();
    answers.push(currentItem);

    for (let x = 0; x < numIndicesToSelect; x++){
      let randomIndex = Math.round(Math.random() * (answerPool.length - 1));
      answers.push(answerPool[randomIndex])
      answerPool.splice(randomIndex, 1);
    }

    shuffleArray(answers)
    setAnswers(answers)
    setHasGuessed(false);
  
  },[currentItem])

  const showSummary = (studyMode?.index === studyMode?.cards?.length);
  const showProgress = (studyMode?.index < studyMode?.cards?.length);
  const showNonBackActions = !showSummary;

  return (
    <div className={styles.StudyControlsRoot}>
      <div className={styles.QuizAnswers}>
        {
          answers?.length > 1 && answers.map((answer) => {
            const answerClasses = clsx({
              [styles.clickedWrong]: answer.clickedWrong,
              [styles.clickedCorrect]: answer.clickedCorrect,
              [styles.quizAnswer]: true
            })
            return <div key={answer._id} className={answerClasses} onClick={() => {onClickAnswer(answer)}}>{answer?.sideB}</div>
          })
        }
      </div>
      {showSummary && <StudyModeSummary progressMap={progressMap}/>}

      {showProgress && (
        <ProgressIndicator
          items={studyMode.cards}
          currentIndex={studyMode.index}
          progressStatuses={userProfile?.cardProgress}
        />
      )}

      <div className={styles.StudyControls}>
        <div className={styles.row}>
        <div className={leftBtnStyles}>
            <Button icon={chevronBack} onClick={onClickBack} size="large" />
          </div>
        </div>
        {showNonBackActions && <div className={styles.row}>
          <div className={styles.negativeBtn}>
              <div className={downBtnStyles}>
                <Button
                  icon={closeOutline}
                  onClick={negativeProgress}
                  size="large"
                />
              </div>
            </div>
            <div className={inverterBtnStyles}>
              <Button
                  icon={invertModeOutline}
                  onClick={onClickToggleObscure}
                  size="large"
                />
            </div>
            <div className={styles.positiveBtn}>
              <div className={upBtnStyles}>
                <Button
                  icon={checkmarkOutline}
                  onClick={positiveProgress}
                  size="large"
                />
              </div>
            </div>
            <div className={rightBtnStyles}>
              <Button icon={chevronForward} onClick={onClickForward} size="large" />
            </div>
          </div>}
      </div>
    </div>
  );
};

export { StudyControls };
