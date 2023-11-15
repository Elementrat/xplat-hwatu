"use client";
import { UIContext, useCurrentUserCards } from "xplat-lib";
import s from "./GlobalSearch.module.css";

import { TextInput, STR } from "ux";
import clsx from "clsx";
import { ChangeEvent, useContext } from "react";
import { useCurrentUserTags } from "xplat-lib/client-api/tags";
import { MultiSelect } from "ux";

const GlobalSearch = () => {
  const { search, updateSearchText } = useContext(UIContext);
  const { tags } = useCurrentUserTags();

  const { cards, isLoading } = useCurrentUserCards();

  const classes = clsx({
    [s.globalSearch]: true,
    [s.show]: cards?.length > 0
  });

  const searchTagValues = tags?.map((tag) => {
    return { label: tag.title, value: tag.title };
  });

  const onSelectOption = () => {};

  const onRemoveValue = () => {};

  const onSearchChange = (newSearchText: string) => {
    if (newSearchText) {
      updateSearchText(newSearchText);
    }
  };

  return (
    <div className={classes}>
      <MultiSelect
        knownOptions={searchTagValues}
        onSelectOption={onSelectOption}
        onRemoveValue={onRemoveValue}
        placeholder={"Search"}
        onInputChange={onSearchChange}
      />
    </div>
  );
};

export default GlobalSearch;
