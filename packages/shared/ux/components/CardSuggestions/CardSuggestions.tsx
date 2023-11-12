"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./CardSuggestions.module.css";
import { clsx } from "clsx";
import { IonIcon } from "@ionic/react";
import { flaskOutline } from "ionicons/icons";
import { TranslationContext } from "xplat-lib";
import STR from "../../strings/strings";

const DELAY = 2000;

interface Suggestion {
  to: string;
  from: string;
  text: string;
}

const CardSuggestions = ({ inputText, onClickSuggestion }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [timeoutID, setTimeoutID] = useState();
  const { tryTranslate } = useContext(TranslationContext);

  const tryGetSuggestions = async () => {
    if (inputText?.length > 1) {
      const translationResults = await tryTranslate(inputText);
      if (translationResults?.length) {
        setSuggestions(translationResults);
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
      {Boolean(suggestions?.length) && <span>{STR.SUGGESTED}</span>}
      {suggestions.map((suggestion) => {
        return (
          <div
            className={styles.cardSuggestion}
            key={suggestion.text}
            onClick={() => {
              onClickSuggestion(suggestion.text);
            }}
          >
            {suggestion?.text}
          </div>
        );
      })}
    </div>
  );
};

export { CardSuggestions };
