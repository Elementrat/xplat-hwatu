"use client";
import { UIContext, useCurrentUserCards } from "xplat-lib";
import s from "./GlobalSearch.module.css";
import strings from "./GlobalSearch.strings";
import { TextInput } from "ux";
import clsx from "clsx";
import { ChangeEvent, useContext } from "react";

const GlobalSearch = () => {
  const { searchText, updateSearchText } = useContext(UIContext);
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateSearchText(e?.currentTarget?.value);
  };
  const { cards, isLoading } = useCurrentUserCards();

  const classes = clsx({
    [s.globalSearch]: true,
    [s.show]: cards?.length > 0
  });

  return (
    <div className={classes}>
      <TextInput
        placeholder={isLoading ? "Loading..." : strings.SEARCH_PLACEHOLDER}
        classNames={s.globalSearchInput}
        onChange={onSearchChange}
        value={searchText}
      />
    </div>
  );
};

export default GlobalSearch;
