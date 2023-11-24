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
          {cardsNoProgress?.length > 0 && (
            <Heading text={STR.UNREVIEWED} action={openStudyModeBtn} />
          )}
          {cardsNoProgress?.map((card) => {
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
          {cardsNegativeProgress?.length > 0 && (
            <Heading text={STR.NEEDS_STUDY} action={openStudyModeBtn} />
          )}
          {cardsNegativeProgress?.map((card) => {
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

          {cardsPositiveProgress?.length > 0 && <Heading text={STR.MASTERED} />}
          {cardsPositiveProgress?.map((card) => {
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
