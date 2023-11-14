"use client";
import { UIContext, useCurrentUserCards } from "xplat-lib";
import s from "./GlobalSearch.module.css";

import { TextInput, STR } from "ux";
import clsx from "clsx";
import { ChangeEvent, useContext } from "react";

const GlobalSearch = () => {
  const { search, updateSearchText } = useContext(UIContext);
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (updateSearchText) {
      updateSearchText(e?.currentTarget?.value);
    }
  };
  const { cards, isLoading } = useCurrentUserCards();

  const classes = clsx({
    [s.globalSearch]: true,
    [s.show]: cards?.length > 0
  });

  return (
    <div className={classes}>
      <TextInput
        placeholder={isLoading ? STR.LOADING : STR.SEARCH}
        classNames={s.globalSearchInput}
        onChange={onSearchChange}
        value={search?.text}
      />
    </div>
  );
};

export default GlobalSearch;
