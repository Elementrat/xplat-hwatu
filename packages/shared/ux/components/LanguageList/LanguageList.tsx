import React from "react";
import STR from "../../strings/strings";
import styles from "./LanguageList.module.css";

const LanguageList = ({ languages }) => {
  return (
    <div className={styles.LanguageList}>
      <div className="text-md font-black">{STR.LANGUAGES}</div>
      <div className="flex gap-3">
        {languages.map((lang) => {
          return <div key={lang}>{lang}</div>;
        })}
      </div>
    </div>
  );
};

export { LanguageList };
