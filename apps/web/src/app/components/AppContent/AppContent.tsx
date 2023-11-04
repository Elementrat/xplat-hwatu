
import GlobalSearch from "../GlobalSearch/GlobalSearch";
import styles from "./AppContent.module.css"

const AppContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
 return <div className={styles.appContent}>
  <GlobalSearch/>
  {children}
 </div>
}

export default AppContent;