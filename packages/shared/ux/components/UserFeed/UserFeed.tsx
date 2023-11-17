"use client";

import React, { useContext } from "react";
import styles from "./UserFeed.module.css";
import {
  UIContext,
  filters,
  useCurrentUserCards,
  useCurrentUserTags
} from "xplat-lib";
import { InputCard } from "../InputCard/InputCard";
import { sorts } from "xplat-lib";
import STR from "../../strings/strings";
import clsx from "clsx";
import { StudyControls } from "../StudyControls/StudyControls";

const UserFeed = () => {
  const { displayCards, searchText, studyMode } = useContext(UIContext);

  let visibleCards = displayCards;
  if (studyMode.active) {
    visibleCards = [displayCards[studyMode.index]];
  }

  return (
    <div className={styles.UserFeed}>
      {Boolean(!searchText?.length) && !studyMode.active && <InputCard />}
      {visibleCards?.map((card) => {
        return card?._id && <InputCard cardID={card?._id} key={card?._id} />
      })}
      {studyMode.active && <StudyControls />}
    </div>
  );
};

export { UserFeed };
