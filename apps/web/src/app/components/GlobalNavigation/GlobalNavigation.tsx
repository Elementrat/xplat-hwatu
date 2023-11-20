"use client";
import { useState, useContext, useEffect } from "react";
import styles from "./GlobalNavigation.module.css";
import AuthManager from "../AuthManager/AuthManager";
import { UserTags } from "ux";
import clsx from "clsx";
import { IonIcon } from "@ionic/react";
import { menuOutline, chevronUp } from "ionicons/icons";
import { LanguageList, DebugInfo } from "ux";
import { CONSTANTS, UIContext } from "xplat-lib";

const EXPAND_BREAKPOINT = 900;

const GlobalNavigation = () => {
  const [expanded, setExpanded] = useState(
    window?.innerWidth < EXPAND_BREAKPOINT ? false : true
  );
  const { studyMode } = useContext(UIContext);
  const [knownStudyMode, setKnownStudyMode] = useState(studyMode.active);

  const handleResize = (e: any) => {
    const windowWidth = e.target.innerWidth;
    if (!expanded) {
      if (windowWidth > EXPAND_BREAKPOINT) {
        setExpanded(true);
      }
    }
  };

  const onMouseLeaveNav = () => {
    if (window.innerWidth > EXPAND_BREAKPOINT && studyMode.active) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    if (expanded && studyMode.active && studyMode.active !== knownStudyMode) {
      setExpanded(false);
    }
    if (!studyMode.active && !expanded && knownStudyMode !== studyMode.active) {
      if (window.innerWidth > EXPAND_BREAKPOINT) {
        setExpanded(true);
      }
    }
    setKnownStudyMode(studyMode.active);
  }, [studyMode, expanded, knownStudyMode]);

  useEffect(() => {
    if (typeof window !== CONSTANTS.UNDEFINED) {
      window.addEventListener("resize", handleResize);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navClasses = clsx({
    [styles.nav]: true,
    [styles.expanded]: expanded
  });

  const toggleClasses = clsx({
    [styles.btnToggleExpand]: true,
    "cursor-pointer": true,
    "select-none": true,
    [styles.expanded]: expanded
  });

  const toggleExpanded = () => {
    setExpanded((ex) => {
      return !ex;
    });
  };

  return (
    <div className={navClasses} onMouseLeave={onMouseLeaveNav}>
      <div className={styles.alwaysVisibleNavContent}>
        <div className="text-3xl font-bold text-center">Hwatu</div>
        <AuthManager />
        <div onClick={toggleExpanded} className={toggleClasses}>
          <IonIcon
            color={"#FFF"}
            icon={expanded ? chevronUp : menuOutline}
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
