"use client";
import React, { useCallback, useEffect, useState } from "react";
import { createContext } from "react";
import { TranslationProvider } from "./TranslationProvider";
import { TagClass } from "..";

type ModalState = {
  login: boolean;
};

interface PersistentUIState {
  searchTags: Array<TagClass>;
  searchText: string;
  languages?: Array<string>;
  modals?: ModalState;
  studyMode: StudyModeState;
}

interface StudyModeState {
  active: boolean;
}

interface UIStateAndControls extends PersistentUIState {
  updateSearchText: Function;
  addLanguagePreference: Function;
  updateSearchTags: Function;
  toggleLoginModal: Function;
  toggleStudyMode: Function;
}

const defaultUIStateAndControls: UIStateAndControls = {
  searchTags: [],
  searchText: "",
  languages: ["en", "ko"],
  updateSearchText: Function,
  updateSearchTags: Function,
  toggleLoginModal: Function,
  toggleStudyMode: Function,
  addLanguagePreference: Function,
  modals: {
    login: false
  },
  studyMode: {
    active: false
  }
};

const defaultPersistentUIState: PersistentUIState = {
  searchTags: [],
  searchText: "",
  languages: ["en", "ko"],
  modals: {
    login: false
  },
  studyMode: {
    active: false
  }
};

const cacheKey = "app-ui-cache";

const UIContext = createContext(defaultUIStateAndControls);

let initialValue: PersistentUIState = defaultPersistentUIState;

try {
  if (typeof window !== "undefined") {
    let storedValue = localStorage.getItem(cacheKey);
    if (storedValue) {
      let cachedUIState = JSON.parse(storedValue);
      if (cachedUIState) {
        initialValue = cachedUIState;
      }
    }
  }
} catch (e) {}

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [persistentUIState, setPersistentUIState] = useState(initialValue);

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

  const toggleLoginModal = (newValue: boolean) => {
    setPersistentUIState((prev) => {
      const newLoginState =
        typeof newValue !== "undefined" ? newValue : !prev.modals?.login;
      return {
        ...prev,
        modals: {
          ...prev.modals,
          login: newLoginState
        }
      };
    });
  };

  const toggleStudyMode = (newValue: boolean) => {
    setPersistentUIState((prev) => {
      const newStudyModeState =
        typeof newValue !== "undefined" ? newValue : !prev.studyMode?.active;
      return {
        ...prev,
        studyMode: {
          ...prev.studyMode,
          active: newStudyModeState
        }
      };
    });
  };

  return (
    <UIContext.Provider
      value={{
        ...persistentUIState,
        updateSearchText,
        updateSearchTags,
        addLanguagePreference,
        toggleLoginModal,
        toggleStudyMode
      }}
    >
      <TranslationProvider>{children}</TranslationProvider>
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
