"use client";
import { useCurrentUserCards } from "xplat-lib";
import s from "./GlobalSearch.module.css";
import strings from "./GlobalSearch.strings";
import { TextInput } from "ux";
import clsx from "clsx";

const GlobalSearch = () => {
  const onSearchChange = () => {};
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
      />
    </div>
  );
};

export default GlobalSearch;
