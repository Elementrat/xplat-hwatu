"use client";
import styles from "./GlobalNavigation.module.css";
import GlobalNavigationLinks from "../GlobalNavigationLinks/GlobalNavigationLinks";
import AuthManager from "../AuthManager/AuthManager";
import { CardClass, useCards } from "xplat-lib";
import { UserCards } from "ux";

const GlobalNavigation = () => {
  return (
    <div className={styles.nav}>
      <AuthManager />
      <GlobalNavigationLinks />
      <UserCards />
    </div>
  );
};

export default GlobalNavigation;
