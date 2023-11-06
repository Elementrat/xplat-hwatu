import { NavigationLink } from "@/app/api/navigation/route";
import styles from "./styles.module.css";
import Link from "next/link";

const getLinks = () => {
  const links = {
    primary: [{ name: "Home", path: "/" }],
    legal: [{ name: "Privacy" }]
  };
  return links;
};

const GlobalNavigationLinks = () => {
  const data = getLinks();

  if (data) {
    const { primary } = data;
    return (
      <div>
        {primary.map((link: NavigationLink) => {
          return (
            <div className={styles.navItem} key={link.name}>
              <Link href={link.path}>{link.name}</Link>
            </div>
          );
        })}
      </div>
    );
  }
};

export default GlobalNavigationLinks;
