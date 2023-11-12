"use client";
import React, { useEffect, useState } from "react";
import styles from "./CardSuggestions.module.css";
import { TranslatorCredential } from "@azure-rest/ai-translation-text";
import createClient from "@azure-rest/ai-translation-text";

const DELAY = 2000;

const CardSuggestions = ({ inputText }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [timeoutID, setTimeoutID] = useState();

  const tryGetSuggestions = async () => {
    const translateCedential: TranslatorCredential = {
      key: "85b9501d87ce4de3a2315e6359ad52e7",
      region: "westus2"
    };

    const translationClient = await createClient(
      "https://api.cognitive.microsofttranslator.com/",
      translateCedential
    );

    const translateResponse = await translationClient.path("/translate").post({
      body: [{ text: inputText }],
      queryParameters: { to: "ko", from: "en" }
    });

    console.log("__TRANSLATION_RESPONSE", translateResponse);
  };

  useEffect(() => {
    if (inputText) {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      const id = setTimeout(tryGetSuggestions, DELAY);
      setTimeoutID(id);
    }
  }, [inputText]);
  return <div className={styles.CardSuggestions}>suggestions</div>;
};

export { CardSuggestions };
