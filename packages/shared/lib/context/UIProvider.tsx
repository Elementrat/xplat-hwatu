"use client";
import React from "react";
import { createContext } from "react";
import useLocalStorage from "use-local-storage";

import { TranslationProvider } from "./TranslationProvider";

interface PersistentUIState {
  searchText: string;
  languages: Array<string>;
}

interface UIStateAndControls extends PersistentUIState {
  updateSearchText: Function;
  addLanguagePreference: Function;
}

const defaultUIStateAndControls: UIStateAndControls = {
  searchText: "",
  languages: ["en", "ko"],
  updateSearchText: Function,
  addLanguagePreference: Function
};

const defaultPersistentUIState: PersistentUIState = {
  searchText: "",
  languages: ["en", "ko"]
};

const UIContext = createContext(defaultUIStateAndControls);

const UIProvider = ({ children }: { children: React.ReactNode }) => {
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
    updateSearchText,
    addLanguagePreference
  };
  return (
    <UIContext.Provider value={sharedUI}>
      <TranslationProvider>{children}</TranslationProvider>
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
