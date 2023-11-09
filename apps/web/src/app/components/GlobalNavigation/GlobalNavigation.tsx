"use client";
import { useState } from "react";
import styles from "./GlobalNavigation.module.css";
import GlobalNavigationLinks from "../GlobalNavigationLinks/GlobalNavigationLinks";
import AuthManager from "../AuthManager/AuthManager";
import { UserCards } from "ux";
import clsx from "clsx";
import { IonIcon } from "@ionic/react";
import { menuOutline } from "ionicons/icons";

const GlobalNavigation = () => {
  const [expanded, setExpanded] = useState(false);

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
        <h2 className="text-2xl text-center">Hwatu</h2>
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
      </div>
    </div>
  );
};

export default GlobalNavigation;
