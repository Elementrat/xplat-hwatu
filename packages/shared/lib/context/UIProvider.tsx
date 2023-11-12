"use client";
import React, { useEffect } from "react";
import { createContext } from "react";
import useLocalStorage from "use-local-storage";
import { useCurrentUserCards } from "..";
import { detect } from "tinyld";

interface PersistentUIState {
  searchText: string;
  languages: Array<string>;
}

interface UIStateAndControls extends PersistentUIState {
  updateSearchText: Function;
}

const defaultUIStateAndControls: UIStateAndControls = {
  searchText: "",
  languages: ["en", "ko"],
  updateSearchText: Function
};

const defaultPersistentUIState: PersistentUIState = {
  searchText: "",
  languages: ["en", "ko"]
};

const UIContext = createContext(defaultUIStateAndControls);

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const { cards } = useCurrentUserCards();

  const [persistentUIState, setPersistentUIState] =
    useLocalStorage<PersistentUIState>("app-ui", defaultPersistentUIState);

  const updateSearchText = (newSearchText: string) => {
    setPersistentUIState({ ...persistentUIState, searchText: newSearchText });
  };

  const addLanguagePreference = (newLanguageCode: string) => {
    setPersistentUIState({
      ...persistentUIState,
      languages: [...persistentUIState?.languages, newLanguageCode]
    });
  };

  const sharedUI: UIStateAndControls = {
    ...persistentUIState,
    updateSearchText
  };

  useEffect(() => {
    const tryThing = async () => {
      if (typeof window !== "undefined") {
        if (cards) {
          for (let card of cards) {
            const detectedLang = detect(card?.title);
            if (!sharedUI?.languages?.includes(detectedLang)) {
              addLanguagePreference(detectedLang);
            }
          }
        }
      }
    };
    tryThing();
  }, [cards]);

  return <UIContext.Provider value={sharedUI}>{children}</UIContext.Provider>;
};

export { UIProvider, UIContext };
