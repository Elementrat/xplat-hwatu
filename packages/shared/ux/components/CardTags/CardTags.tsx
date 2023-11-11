import React from "react";

import styles from "./CardTags.module.css";
import { Button } from "../Button/Button";
import { bookmarksOutline } from "ionicons/icons";

const CardTags = () => {
  return (
    <div className={styles.cardTags}>
      <Button icon={bookmarksOutline} />
      <div className={styles.cardTag}>@me</div>
    </div>
  );
};

export { CardTags };
