"use client";
import React, { useEffect } from "react";
import { createContext } from "react";
import useLocalStorage from "use-local-storage";

import { TranslationProvider } from "./TranslationProvider";

interface PersistentUIState {
  search?: {
    text?: string;
    tags?: Array<string>;
  };
  languages?: Array<string>;
  wow2?: string;
}

interface UIStateAndControls extends PersistentUIState {
  updateSearchText: Function;
  addLanguagePreference: Function;
  updateSearchTags: Function;
}

const defaultUIStateAndControls: UIStateAndControls = {
  search: {
    text: "",
    tags: []
  },
  languages: ["en", "ko"],
  updateSearchText: Function,
  updateSearchTags: Function,
  addLanguagePreference: Function
};

const defaultPersistentUIState: PersistentUIState = {
  search: {
    text: "",
    tags: []
  },
  languages: ["en", "ko"],
  wow2: "newkey"
};

const UIContext = createContext(defaultUIStateAndControls);

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [persistentUIState, setPersistentUIState] =
    useLocalStorage<PersistentUIState>("app-ui", defaultPersistentUIState);

  useEffect(() => {
    // Determine missing keys, in case user has a cached version of the state
    let missingCacheValues: Record<string, object> = {};
    for (let [key, val] of Object.entries(defaultPersistentUIState)) {
      if (!Object.keys(persistentUIState).includes(key)) {
        missingCacheValues[key] = val;
      }
    }
    if (Object.keys(missingCacheValues)?.length) {
      setPersistentUIState({ ...persistentUIState, ...missingCacheValues });
    }
  }, [persistentUIState]);

  const updateSearchText = (newSearchText: string) => {
    setPersistentUIState({
      ...persistentUIState,
      search: { ...persistentUIState.search, text: newSearchText }
    });
  };

  const updateSearchTags = (newSearchTags: Array<string>) => {
    console.log("__SETTNG", newSearchTags);
    setPersistentUIState({
      ...persistentUIState,
      search: { ...persistentUIState.search, tags: ["WWOW"], text: "wtf" }
    });
    updateSearchText("BRO_ HUH");
  };

  const addLanguagePreference = (newLanguageCode: string) => {
    setPersistentUIState({
      ...persistentUIState,
      languages: [...(persistentUIState?.languages || []), newLanguageCode]
    });
  };

  const sharedUI: UIStateAndControls = {
    ...persistentUIState,
    updateSearchText,
    updateSearchTags,
    addLanguagePreference
  };
  return (
    <UIContext.Provider value={sharedUI}>
      <TranslationProvider>{children}</TranslationProvider>
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
