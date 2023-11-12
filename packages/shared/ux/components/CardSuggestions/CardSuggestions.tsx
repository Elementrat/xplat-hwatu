"use client";
import React, { useEffect, useState } from "react";
import styles from "./CardSuggestions.module.css";
import { translate } from "xplat-lib";
import { clsx } from "clsx";
import { IonIcon } from "@ionic/react";
import { flaskOutline } from "ionicons/icons";

const DELAY = 2000;

const CardSuggestions = ({ inputText }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [timeoutID, setTimeoutID] = useState();

  const tryGetSuggestions = async () => {
    const res = await translate(inputText);
    if (res) {
      if (res.text) {
        setSuggestions([res.text]);
      }
    }
  };

  useEffect(() => {
    if (inputText) {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      const id = setTimeout(tryGetSuggestions, DELAY);
      setTimeoutID(id);
    } else {
      setSuggestions([]);
    }
  }, [inputText]);

  const classes = clsx({
    [styles.CardSuggestions]: true,
    [styles.show]: suggestions.length > 0
  });

  return (
    <div className={classes}>
      <IonIcon icon={flaskOutline} size="small" />
      {suggestions.map((suggestion) => {
        return <div className={styles.cardSuggestion}>{suggestion}</div>;
      })}
    </div>
  );
};

export { CardSuggestions };
