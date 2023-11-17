"use client";

import React, { useEffect, useContext, ReactNode } from "react";
import { detect } from "tinyld";
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

    if (!KNOWN_LANGS.SOURCES.find((knownLang) => knownLang === sourceLang)){
      sourceLang = "en";
    }

    let detectJA = inputText.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/)
    let detectKO = inputText.match(/[\u3131-\uD79D]/ugi);

    if(detectKO){
      sourceLang = "ko"
    }

    if(detectJA){
      sourceLang = "ja";
    }

    if (KNOWN_LANGS.SOURCES.includes(sourceLang)) {
      targetLang = languages?.find(
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
