"use client";
import React, { useMemo } from "react";
import { UIContext, useCurrentUserCards } from "xplat-lib";
import s from "./GlobalSearch.module.css";
import clsx from "clsx";
import { useContext } from "react";
import { useCurrentUserTags } from "xplat-lib/client-api/tags";
import { MultiSelect, STR } from "ux";
import { filters } from "xplat-lib";

const GlobalSearch = () => {
  const { search, updateSearchText } = useContext(UIContext);
  const { tags } = useCurrentUserTags();

  const { cards } = useCurrentUserCards();

  const classes = clsx({
    [s.globalSearch]: true,
    [s.show]: cards?.length > 0
  });

  const onSelectOption = () => {
    console.log("__SELECTO");
  };

  const onRemoveValue = () => {};

  const onSearchChange = (newSearchText?: string) => {
    updateSearchText(newSearchText);
  };

  const displayTags = useMemo(() => {
    return filters.filterTagsWithCards(tags, cards).map((tag) => {
      return { label: tag.title, value: tag.title };
    });
  }, [tags, cards]);

  console.log("__INIT", search?.text);

  return (
    <div className={classes}>
      <MultiSelect
        initialValue={search?.text}
        knownOptions={displayTags}
        onSelectOption={onSelectOption}
        onRemoveValue={onRemoveValue}
        placeholder={STR.SEARCH}
        onInputChange={onSearchChange}
      />
    </div>
  );
};

export default GlobalSearch;
