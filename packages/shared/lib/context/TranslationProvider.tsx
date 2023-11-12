"use client";

import React, { useEffect, useContext, ReactNode } from "react";
import { detect, detectAll } from "tinyld";
import { useCurrentUserCards } from "..";
import { UIContext } from "..";
import { createContext } from "react";
import { translate as translateText } from "xplat-lib";

const LANG_CODES = {
  EN: "en",
  KO: "ko",
  JA: "ja"
};

const KNOWN_LANGS = {
  SOURCES: [LANG_CODES.EN, LANG_CODES.KO, LANG_CODES.JA],
  TARGETS: [LANG_CODES.EN, LANG_CODES.KO, LANG_CODES.JA]
};

interface TranslationInterface {
  translate: Function;
}

const defaultTranslationInterface = {
  tryTranslate: (inputText: string) => {
    return new Promise<any | undefined>(() => undefined);
  }
};

const TranslationContext = createContext(defaultTranslationInterface);

const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { cards } = useCurrentUserCards();
  const { addLanguagePreference, languages } = useContext(UIContext);

  const tryTranslate = async (
    inputText: string
  ): Promise<Array<any> | undefined> => {
    let sourceLang = detect(inputText);
    let targetLang;

    if (!KNOWN_LANGS.SOURCES.includes(sourceLang)) {
      let nonEnglishPrefLang = languages.find((e) => e !== "en");
      if (nonEnglishPrefLang) {
        sourceLang = nonEnglishPrefLang;
      } else {
        sourceLang = "en";
      }
    }

    if (KNOWN_LANGS.SOURCES.includes(sourceLang)) {
      targetLang = languages.find(
        (languagePref) =>
          languagePref !== sourceLang &&
          KNOWN_LANGS.TARGETS.includes(languagePref)
      );
    }
    if (sourceLang && targetLang) {
      const res = await translateText(inputText, {
        to: targetLang,
        from: sourceLang
      });
      if (res) {
        if (res.text) {
          return [{ ...res, from: sourceLang }];
        }
      }
    }
  };

  const translationContext = {
    tryTranslate
  };

  useEffect(() => {
    const tryThing = async () => {
      if (typeof window !== "undefined") {
        if (cards) {
          for (let card of cards) {
            const detectedLang = detect(card?.title);
            if (
              !languages?.includes(detectedLang) &&
              (KNOWN_LANGS.SOURCES.includes(detectedLang) ||
                KNOWN_LANGS.TARGETS.includes(detectedLang))
            ) {
              addLanguagePreference(detectedLang);
            }
          }
        }
      }
    };
    tryThing();
  }, [cards]);
  return (
    <TranslationContext.Provider value={translationContext}>
      {children}
    </TranslationContext.Provider>
  );
};

export { TranslationProvider, TranslationContext };
