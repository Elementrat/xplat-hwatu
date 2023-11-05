import Image from "next/image";
import styles from "./page.module.css";
import { InputCard } from "ux";

export default function Home() {
  return (
    <main className={styles.homePage}>
      <InputCard />
    </main>
  );
}
