import Image from "next/image";
import styles from "./page.module.css";
import { InputCard, UserFeed } from "ux";
import GlobalSearch from "./components/GlobalSearch/GlobalSearch";
export default function Home() {
  return (
    <main className={styles.homePage}>
      <GlobalSearch />
      <UserFeed />
    </main>
  );
}
