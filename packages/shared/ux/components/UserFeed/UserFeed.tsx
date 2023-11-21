"use client";

import React, { useContext } from "react";
import styles from "./UserFeed.module.css";
import {
  UIContext,
  useCurrentUserCards,
  useCurrentUserProfile
} from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";
import { StudyControls } from "../StudyControls/StudyControls";
import GlobalSearch from "../GlobalSearch/GlobalSearch";

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

  return (
    <div className={styles.UserFeed}>
      <GlobalSearch />
      {Boolean(!searchText?.length) && !studyMode.active && <InputCard />}
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
