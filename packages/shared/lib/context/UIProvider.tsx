"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { TranslationProvider } from "./TranslationProvider";
import {
  CardClass,
  TagClass,
  filters,
  mergeDeep,
  sorts,
  useCurrentUserCards,
  useCurrentUserTags
} from "..";

type ModalState = {
  login: boolean;
};

interface TemporalUIState {
  modals?: ModalState;
}

interface PersistentUIState {
  searchTags: Array<TagClass>;
  searchText: string;
  languages?: Array<string>;
  studyMode: StudyModeState;
  displayCards: Array<CardClass>;
}

interface StudyModeState {
  active: boolean;
  index: number;
}

interface UIStateAndControls extends PersistentUIState {
  updateSearchText: Function;
  addLanguagePreference: Function;
  updateSearchTags: Function;
  toggleLoginModal: Function;
  toggleStudyMode: Function;
  updateStudyModeIndex: Function;
  studyModeMoveBackwards: Function;
  studyModeMoveForwards: Function;
}

const defaultPersistentUIState: PersistentUIState = {
  displayCards: [],
  searchTags: [],
  searchText: "",
  languages: ["en", "ko"],
  studyMode: {
    active: false,
    index: 0,
  }
};

const defaultUIStateAndControls: UIStateAndControls & TemporalUIState = {
  updateSearchText: Function,
  updateSearchTags: Function,
  toggleLoginModal: Function,
  toggleStudyMode: Function,
  updateStudyModeIndex: Function,
  addLanguagePreference: Function,
  studyModeMoveBackwards: Function,
  studyModeMoveForwards: Function,
  ...defaultPersistentUIState
};

const defaultTemporalUIState : TemporalUIState = {
  modals: {
    login: false
  },
}

const cacheKey = "app-ui-cache";
const UIContext = createContext(defaultUIStateAndControls);
let initialValue: any = defaultPersistentUIState;

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
  const [temporalUIState, setTemporalUIState] = useState(defaultTemporalUIState)

  const { cards } = useCurrentUserCards();
  const { tags } = useCurrentUserTags();

  useEffect(() => {
    const cardsSortedNewestFirst = sorts.sortByCreatedDate(cards);

    let displayCards = filters.filterBySearchText(
      cardsSortedNewestFirst,
      persistentUIState.searchText
    );

    const validSearchTags = tags?.filter((tag) => {
      let matchingTag = persistentUIState.searchTags?.find(
        (e:TagClass) => e._id === tag.id
      );
      return Boolean(matchingTag);
    });

    let untaggedSearch = persistentUIState.searchTags.find((tag:TagClass) => tag._id === 'untagged');
    if(untaggedSearch){
      displayCards = filters.untaggedCards(tags, displayCards);
    }else{
      displayCards = filters.filterCardsBySearchTags(
        displayCards,
        validSearchTags
      );
    }

    setPersistentUIState({
      ...persistentUIState,
      displayCards,
      studyMode: {
        ...persistentUIState.studyMode,
        index: 0
      }
    });
  }, [persistentUIState.searchText, persistentUIState.searchTags, cards, tags]);

  useEffect(() => {
    localStorage.setItem(cacheKey, JSON.stringify(persistentUIState));
  }, [persistentUIState]);

  useEffect(() => {
    const merged = mergeDeep(defaultPersistentUIState, persistentUIState )
    setPersistentUIState(merged);
  }, []);

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
    setTemporalUIState((prev) => {
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
    setPersistentUIState((prev:PersistentUIState) => {
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

  const updateStudyModeIndex = (newValue: number) => {
    setPersistentUIState((prev:PersistentUIState) => {
      return {
        ...prev,
        studyMode: {
          ...prev.studyMode,
          index: newValue
        }
      };
    });
  };

  const studyModeMoveForwards = () => {
    setPersistentUIState((prev:PersistentUIState) => {

      let numDisplayCards = prev?.displayCards.length;
      let newIndex = prev.studyMode.index;

      if(prev.studyMode.index < numDisplayCards -1){
        newIndex = newIndex + 1;
      }

      return {
        ...prev,
        studyMode: {
          ...prev.studyMode,
          index: newIndex
        }
      };
    });
  };

  
  const studyModeMoveBackwards = () => {
    setPersistentUIState((prev:PersistentUIState) => {
      let newIndex = prev.studyMode.index;
      if(prev.studyMode.index > 0){
        newIndex = newIndex-1;
      }
      return {
        ...prev,
        studyMode: {
          ...prev.studyMode,
          index: newIndex
        }
    }
    });
  };


  return (
    <UIContext.Provider
      value={{
        ...persistentUIState,
        ...temporalUIState,
        updateSearchText,
        updateSearchTags,
        addLanguagePreference,
        toggleLoginModal,
        toggleStudyMode,
        updateStudyModeIndex,
        studyModeMoveBackwards, 
        studyModeMoveForwards
      }}
    >
      <TranslationProvider>{children}</TranslationProvider>
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
