"use client";
import styles from "./GlobalNavigation.module.css";
import GlobalNavigationLinks from "../GlobalNavigationLinks/GlobalNavigationLinks";
import AuthManager from "../AuthManager/AuthManager";
import { CardClass, cardAPI } from "xplat-lib";

const GlobalNavigation = () => {
  const { useCards } = cardAPI;
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
