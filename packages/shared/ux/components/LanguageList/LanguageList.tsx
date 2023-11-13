import React from "react";

import styles from "./LanguageList.module.css";

const LanguageList = ({ languages }) => {
  return (
    <div className={styles.LanguageList}>
      <div className="text-md font-black">langs</div>
      <div className="flex gap-3">
        {languages.map((lang) => {
          return <div>{lang}</div>;
        })}
      </div>
    </div>
  );
};

export { LanguageList };
