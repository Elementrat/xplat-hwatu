"use client";
import React, { useCallback, useEffect, useState } from "react";
import { createContext } from "react";
import { TranslationProvider } from "./TranslationProvider";
import { TagClass } from "..";

interface PersistentUIState {
  searchTags: Array<TagClass>;
  searchText: string;
  languages?: Array<string>;
  wow2?: string;
}

interface UIStateAndControls extends PersistentUIState {
  updateSearchText: Function;
  addLanguagePreference: Function;
  updateSearchTags: Function;
}

const defaultUIStateAndControls: UIStateAndControls = {
  searchTags: [],
  searchText: "",
  languages: ["en", "ko"],
  updateSearchText: Function,
  updateSearchTags: Function,
  addLanguagePreference: Function
};

const defaultPersistentUIState: PersistentUIState = {
  searchTags: [],
  searchText: "",
  languages: ["en", "ko"],
  wow2: "newkey"
};

const cacheKey = "app-ui-cache";

const UIContext = createContext(defaultUIStateAndControls);

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [persistentUIState, setPersistentUIState] = useState(
    JSON.parse(localStorage.getItem(cacheKey) || "") || defaultPersistentUIState
  );

  useEffect(() => {
    localStorage.setItem(cacheKey, JSON.stringify(persistentUIState));
  }, [persistentUIState]);

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

  const updateSearchText = useCallback(
    (newSearchText: string) => {
      setPersistentUIState((cur: PersistentUIState) => {
        return {
          ...cur,
          searchText: newSearchText
        };
      });
    },
    [persistentUIState]
  );

  const updateSearchTags = useCallback(
    (newSearchTags: Array<TagClass>) => {
      setPersistentUIState((cur: PersistentUIState) => {
        return {
          ...cur,
          searchTags: newSearchTags
        };
      });
    },
    [persistentUIState]
  );

  const addLanguagePreference = (newLanguageCode: string) => {
    setPersistentUIState({
      ...persistentUIState,
      languages: [...(persistentUIState?.languages || []), newLanguageCode]
    });
  };

  return (
    <UIContext.Provider
      value={{
        ...persistentUIState,
        updateSearchText,
        updateSearchTags,
        addLanguagePreference
      }}
    >
      <TranslationProvider>{children}</TranslationProvider>
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
