"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./CardSuggestions.module.css";
import { UIContext, useCurrentUserCards } from "xplat-lib";

import { translate } from "xplat-lib";
import { clsx } from "clsx";
import { IonIcon } from "@ionic/react";
import { flaskOutline } from "ionicons/icons";
import { detect } from "tinyld";

import STR from "../../strings/strings";

const KNOWN_LANGS = {
  SOURCES: ["en", "ko", "ja"],
  TARGETS: ["en", "ko"]
};

const DELAY = 2000;

const CardSuggestions = ({ inputText, onClickSuggestion }) => {
  const { languages } = useContext(UIContext);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [timeoutID, setTimeoutID] = useState();

  const tryGetSuggestions = async () => {
    let sourceLang = detect(inputText);
    let targetLang;

    if (!KNOWN_LANGS.SOURCES.includes(sourceLang)) {
      sourceLang = "en";
    }

    if (KNOWN_LANGS.SOURCES.includes(sourceLang)) {
      targetLang = languages.find(
        (languagePref) =>
          languagePref !== sourceLang &&
          KNOWN_LANGS.TARGETS.includes(languagePref)
      );
    }
    if (sourceLang && targetLang) {
      console.log("__SOURCE_TARG", sourceLang, targetLang);
      const res = await translate(inputText, {
        to: targetLang,
        from: sourceLang
      });
      if (res) {
        if (res.text) {
          setSuggestions([res.text]);
        }
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
            key={suggestion}
            onClick={() => {
              onClickSuggestion(suggestion);
            }}
          >
            {suggestion}
          </div>
        );
      })}
    </div>
  );
};

export { CardSuggestions };
