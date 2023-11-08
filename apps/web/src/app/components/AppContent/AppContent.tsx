import styles from "./AppContent.module.css";

const AppContent = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.appContent}>{children}</div>;
};

export default AppContent;
