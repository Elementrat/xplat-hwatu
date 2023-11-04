"use client" 
import styles from "./GlobalNavigation.module.css"
import GlobalNavigationLinks from "../GlobalNavigationLinks/GlobalNavigationLinks";
import AuthManager from "../AuthManager/AuthManager";

const GlobalNavigation = () => {
  return <div className={styles.nav}>
    <AuthManager/>
    <GlobalNavigationLinks/>
  </div>
}

export default GlobalNavigation;