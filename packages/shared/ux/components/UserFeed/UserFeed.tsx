"use client";

import React, { useContext } from "react";
import styles from "./UserFeed.module.css";
import { UIContext, useCurrentUserProfile } from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";
import { StudyControls } from "../StudyControls/StudyControls";
import GlobalSearch from "../GlobalSearch/GlobalSearch";
import { Heading } from "../Heading/Heading";
import STR from "../../strings/strings";
import clsx from "clsx";

const UserFeed = () => {
  const { displayCards, searchText, studyMode } = useContext(UIContext);

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
  })

  return (
    <div className={userFeedStyles}>
      <GlobalSearch />

      {Boolean(!searchText?.length) && !studyMode.active && 
      <>
        <Heading text={STR.CREATE_NEW_CARD}/>
        <InputCard />
      </>
      }
      <Heading text={studyMode.active ? STR.STUDY_MODE : STR.YOUR_CARDS }/>
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
      {studyMode.active && <StudyControls />}
    </div>
  );
};

export { UserFeed };
