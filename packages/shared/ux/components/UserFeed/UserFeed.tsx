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
import { CARD_PROGRESS } from "xplat-lib/models/UserProfile";
import { Button } from "../Button/Button";
import { schoolOutline } from "ionicons/icons";
import { FeedCardGroup } from "../FeedCardGroup/FeedCardGroup";

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

  const openStudyModeBtn = (
    <Button
      label="Review"
      icon={schoolOutline}
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
        <FeedCardGroup cards={cardsNoProgress} headingText={STR.UNREVIEWED} action={openStudyModeBtn} progressMap={progressMap}/>
        <FeedCardGroup cards={cardsNegativeProgress} headingText={STR.NEEDS_STUDY} action={openStudyModeBtn} progressMap={progressMap}/>
        <FeedCardGroup cards={cardsPositiveProgress} headingText={STR.MASTERED} progressMap={progressMap}/>
        </>)}

      {studyMode.active && (
        <>
          <Heading text={STR.STUDY_MODE} />
          {visibleCards?.map((card) => {
            return (
              card?._id && (
                <InputCard
                  cardID={card?._id}
                  key={card?._id}
                  progressMap={progressMap}
                />
              )
            );
          })}
        </>
      )}

      {studyMode.active && <StudyControls />}
    </div>
  );
};

export { UserFeed };
