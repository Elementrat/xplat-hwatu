"use client";
import React, { useEffect, useState } from "react";
import styles from "./CardSuggestions.module.css";

const DELAY = 2000;

const CardSuggestions = ({ inputText }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [timeoutID, setTimeoutID] = useState();

  const tryGetSuggestions = async () => {
    console.log("__WOW");
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
