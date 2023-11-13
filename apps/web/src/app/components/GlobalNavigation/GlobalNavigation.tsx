"use client";
import { useState, useContext } from "react";
import styles from "./GlobalNavigation.module.css";
import GlobalNavigationLinks from "../GlobalNavigationLinks/GlobalNavigationLinks";
import AuthManager from "../AuthManager/AuthManager";
import { UserCards, UserTags } from "ux";
import clsx from "clsx";
import { IonIcon } from "@ionic/react";
import { menuOutline } from "ionicons/icons";
import { LanguageList } from "ux";
import { UIContext } from "xplat-lib";

const GlobalNavigation = () => {
  const [expanded, setExpanded] = useState(false);
  const { addLanguagePreference, languages } = useContext(UIContext);

  const navClasses = clsx({
    [styles.nav]: true,
    [styles.expanded]: expanded
  });

  const toggleClasses = clsx({
    [styles.btnToggleExpand]: true,
    "cursor-pointer": true,
    "select-none": true
  });

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
        <UserCards />
        <UserTags />
        <LanguageList languages={languages} />
      </div>
    </div>
  );
};

export default GlobalNavigation;
