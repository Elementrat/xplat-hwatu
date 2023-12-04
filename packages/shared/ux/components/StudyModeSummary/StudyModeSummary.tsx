import React, { useContext } from 'react';
import styles from "./StudyModeSummary.module.css";
import  { getCardProgressGroups } from  "xplat-lib"
import {  UIContext } from "xplat-lib";
import STR from '../../strings/strings';
import clsx from 'clsx';
import { Button } from '../Button/Button';

import {
    schoolOutline,
    bookOutline
  } from "ionicons/icons";
import { UserCards } from '../UserCards/UserCards';

const StudyModeSummary = ({progressMap}) => {
    const {
        studyMode,
        studyModeMoveToBeginning,
        toggleStudyMode,
      } = useContext(UIContext);

    const { cardsNegativeProgress, cardsPositiveProgress, cardsNoProgress} = getCardProgressGroups(studyMode?.cards, progressMap);

    const numCards = studyMode?.cards?.length;

    const summaryTitleStyles = clsx({
        [styles.summaryTitle]: true, 
        'font-bold': true
    })

    const negativeStyles = clsx({
        [styles.negative]: true, 
        [styles.summaryLineText]: true,
    })

    const positiveStyles = clsx({
        [styles.positive]: true, 
        [styles.summaryLineText]: true,
    })

    const onClickStartOver = () => {
        studyModeMoveToBeginning();
    }

    const onClickExitReview = () => {
        toggleStudyMode();
    }

    return <div className={styles.StudyModeSummary}>
      <div className={summaryTitleStyles}>Review Complete!</div>


      {cardsPositiveProgress?.length > 0 && <div className={styles.summaryRow}>
            <span className={positiveStyles}> {cardsPositiveProgress?.length} {STR.MASTERED} </span>
        </div>}

        <div>
            <UserCards cards={cardsPositiveProgress}/>
        </div>

        <div className={styles.summaryRow}>
            <span className={negativeStyles}> {cardsNegativeProgress?.length} {STR.NEEDS_STUDY}</span>
        </div>
        {cardsNoProgress?.length > 0 &&  <div className={styles.summaryRow}>
                <span className={styles.summaryLineText}> {cardsNoProgress?.length} {STR.UNKNOWN}</span>
             </div>
             }
        <div>
            <UserCards cards={cardsNegativeProgress}/>
        </div>

        <div className={styles.actions}>
            <Button label={STR.START_OVER} icon={bookOutline} onClick={onClickStartOver}/>
            <Button label={STR.EXIT_REVIEW} icon={schoolOutline} onClick={onClickExitReview}/>
        </div>
    </div>
}

export { StudyModeSummary };