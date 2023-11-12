"use client";
import React, { useState } from "react";
import { createContext } from "react";
import useLocalStorage from "use-local-storage";

interface UIState {
  searchText: string;
}

interface UIStateAndControls extends UIState {
  updateSearchText: Function;
}

const defaultUIState: UIStateAndControls = {
  searchText: "",
  updateSearchText: Function
};

const UIContext = createContext(defaultUIState);

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const updateSearchText = (newSearchText: string) => {
    setUIState({ ...persistentUIState, searchText: newSearchText });
  };

  const defaultUIState: UIState = {
    searchText: ""
  };

  const [persistentUIState, setUIState] = useLocalStorage<UIState>(
    "app-ui",
    defaultUIState
  );

  const sharedUI: UIStateAndControls = {
    ...persistentUIState,
    updateSearchText
  };

  return <UIContext.Provider value={sharedUI}>{children}</UIContext.Provider>;
};

export { UIProvider, UIContext };
