"use client";
import styles from "./GlobalNavigation.module.css";
import GlobalNavigationLinks from "../GlobalNavigationLinks/GlobalNavigationLinks";
import AuthManager from "../AuthManager/AuthManager";
import { CardClass, useCards } from "xplat-lib";

const GlobalNavigation = () => {
  const { data, isLoading, isError } = useCards();

  return (
    <div className={styles.nav}>
      <AuthManager />
      <GlobalNavigationLinks />
      {data?.cards?.map((card: CardClass) => {
        return <div key={card.id}>{card.title}</div>;
      })}
    </div>
  );
};

export default GlobalNavigation;
