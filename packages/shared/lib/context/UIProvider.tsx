"use client";
import React, { useState } from "react";
import { createContext } from "react";

interface UIState {
  searchText: string;
  updateSearchText: Function;
}

const defaultUIState: UIState = {
  searchText: "",
  updateSearchText: () => {}
};

const UIContext = createContext(defaultUIState);

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const updateSearchText = (newSearchText: string) => {
    setUIState({ ...UIState, searchText: newSearchText });
  };

  const defaultUIState: UIState = {
    searchText: "",
    updateSearchText
  };

  const [UIState, setUIState] = useState(defaultUIState);

  return <UIContext.Provider value={UIState}>{children}</UIContext.Provider>;
};

export { UIProvider, UIContext };
