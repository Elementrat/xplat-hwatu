import React, { useContext } from 'react';
import styles from "./StudyModeSummary.module.css";
import { Heading } from '../Heading/Heading';
import  { getCardProgressGroups, getItemProgressStatuses } from  "xplat-lib"
import {  UIContext } from "xplat-lib";
import STR from '../../strings/strings';
import clsx from 'clsx';

const StudyModeSummary = ({progressMap}) => {
    const {
        studyMode,
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

    return <div className={styles.StudyModeSummary}>
      <div className={summaryTitleStyles}>Review Complete!</div>
      <div className={styles.summaryRow}>
            <span className={positiveStyles}> {cardsPositiveProgress?.length}/{numCards} {STR.MASTERED} </span>
        </div>
        <div className={styles.summaryRow}>
            <span className={negativeStyles}> {cardsNegativeProgress?.length}/{numCards} {STR.NEEDS_STUDY}</span>
        </div>
        {cardsNoProgress?.length > 0 &&  <div className={styles.summaryRow}>
                <span className={styles.summaryLineText}> {cardsNoProgress?.length}/{numCards} {STR.UNKNOWN}</span>
             </div>
             }
    </div>
}

export { StudyModeSummary };