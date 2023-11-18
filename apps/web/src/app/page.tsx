import Image from "next/image";
import styles from "./page.module.css";
import { UserFeed, GlobalSearch } from "ux";

export default function Home() {
  return (
    <main className={styles.homePage}>
      <UserFeed />
    </main>
  );
}
