"use client";

import React, { useContext } from "react";
import styles from "./UserFeed.module.css";
import { UIContext, getCardProgressGroups, useCurrentUserProfile } from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";
import { StudyControls } from "../StudyControls/StudyControls";
import GlobalSearch from "../GlobalSearch/GlobalSearch";
import { Heading } from "../Heading/Heading";
import STR from "../../strings/strings";
import clsx from "clsx";
import { Button } from "../Button/Button";
import { schoolOutline, bookOutline } from "ionicons/icons";
import { FeedCardGroup } from "../FeedCardGroup/FeedCardGroup";
import { StudyModeFilterType } from "xplat-lib/context/UIProvider";

const UserFeed = () => {
  const { displayCards, searchText, studyMode, toggleStudyMode } =
    useContext(UIContext);

  const { userProfile } = useCurrentUserProfile();

  let visibleCards = displayCards;
  if (studyMode.active) {
    visibleCards = [displayCards[studyMode.index]];
  }

  let progressMap;

  if (userProfile?.cardProgress) {
    progressMap = new Map(Object.entries(userProfile?.cardProgress));
  }

  const userFeedStyles = clsx({
    [styles.UserFeed]: true,
    [styles.StudyMode]: studyMode.active
  });

  const { cardsNegativeProgress, cardsPositiveProgress, cardsNoProgress} = getCardProgressGroups(visibleCards, progressMap);

  let studyModeCards = visibleCards;

  if (studyMode?.filters?.find((filter) => filter.type === StudyModeFilterType.STUDY_MODE_FILTER_NEGATIVE_PROGRESS)){
    studyModeCards = cardsNegativeProgress;
  }

  const openStudyModeNegativeBtn = (
    <Button
      label="Review"
      icon={schoolOutline}
      onClick={() => {
        toggleStudyMode(true, [{
          type: StudyModeFilterType.STUDY_MODE_FILTER_NEGATIVE_PROGRESS
        }]);
      }}
    />
  );

  const openStudyModePositiveBtn = (
    <Button
      label="Review"
      icon={schoolOutline}
      onClick={() => {
        toggleStudyMode(true, [{
          type: StudyModeFilterType.STUDY_MODE_FILTER_POSITIVE_PROGRESS
        }]);
      }}
    />
  );

  const openStudyModeNoProgressBtn = (
    <Button
      label="Review"
      icon={schoolOutline}
      onClick={() => {
        toggleStudyMode(true, [{
          type: StudyModeFilterType.STUDY_MODE_FILTER_NO_PROGRESS
        }]);
      }}
    />
  );

  const openEditModeBtn = (
    <Button
      label="Exit Review"
      icon={bookOutline}
      onClick={() => {
        toggleStudyMode();
      }}
    />
  );

  return (
    <div className={userFeedStyles}>
      <GlobalSearch />

      {Boolean(!searchText?.length) && !studyMode.active && (
        <>
          <Heading text={STR.CREATE_NEW_CARD} />
          <InputCard />
        </>
      )}

      {!studyMode.active && (
        <>
          <FeedCardGroup cards={cardsNoProgress} headingText={STR.UNREVIEWED} action={openStudyModeNoProgressBtn} progressMap={progressMap}/>
          <FeedCardGroup cards={cardsNegativeProgress} headingText={STR.NEEDS_STUDY} action={openStudyModeNegativeBtn} progressMap={progressMap}/>
          <FeedCardGroup cards={cardsPositiveProgress} headingText={STR.MASTERED} action={openStudyModePositiveBtn} progressMap={progressMap}/>
        </>
      )}

      {studyMode.active && (
         <FeedCardGroup cards={studyModeCards} headingText={STR.STUDY_MODE} action={openEditModeBtn} progressMap={progressMap}/>
         )
      }

      {studyMode.active && <StudyControls />}
    </div>
  );
};

export { UserFeed };
