"use client";
import { useState, useContext, useEffect } from "react";
import styles from "./GlobalNavigation.module.css";
import AuthManager from "../AuthManager/AuthManager";
import { UserTags } from "ux";
import clsx from "clsx";
import { IonIcon } from "@ionic/react";
import { menuOutline } from "ionicons/icons";
import { LanguageList, DebugInfo } from "ux";
import { UIContext } from "xplat-lib";

const GlobalNavigation = () => {
  const [expanded, setExpanded] = useState(false);
  const { studyMode } = useContext(UIContext);
  const [knownStudyMode, setKnownStudyMode] = useState(studyMode.active);

  const navClasses = clsx({
    [styles.nav]: true,
    [styles.expanded]: expanded
  });

  const toggleClasses = clsx({
    [styles.btnToggleExpand]: true,
    "cursor-pointer": true,
    "select-none": true
  });

  useEffect(() => {
    if (expanded && studyMode.active && studyMode.active !== knownStudyMode) {
      setExpanded(false);
      setKnownStudyMode(studyMode.active);
    }
  }, [studyMode, expanded, knownStudyMode]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={navClasses}>
      <div className={styles.alwaysVisibleNavContent}>
        <div className="text-3xl font-bold text-center">Hwatu</div>
        <AuthManager />
        <div onClick={toggleExpanded} className={toggleClasses}>
          <IonIcon
            color={"#FFF"}
            onClick={toggleExpanded}
            icon={menuOutline}
            size="large"
          />
        </div>
      </div>
      <div className={styles.visibleWhenExpandedNavContent}>
        <UserTags />
      </div>
    </div>
  );
};

export default GlobalNavigation;
