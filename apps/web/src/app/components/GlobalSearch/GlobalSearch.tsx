"use client";
import React, { useMemo, useContext, useCallback } from "react";
import { UIContext, useCurrentUserCards } from "xplat-lib";
import s from "./GlobalSearch.module.css";
import clsx from "clsx";
import { useCurrentUserTags } from "xplat-lib/client-api/tags";
import { MultiSelect, STR, createOption, MultiSelectOption } from "ux";
import { filters } from "xplat-lib";

const GlobalSearch = () => {
  const { searchText, searchTags, updateSearchText, updateSearchTags } =
    useContext(UIContext);
  const { tags } = useCurrentUserTags();
  const { cards } = useCurrentUserCards();

  const classes = clsx({
    [s.globalSearch]: true,
    [s.show]: cards?.length > 0
  });

  const onSelectOption = (e: any) => {
    if (searchTags?.includes(e.value)) {
      const newSearchTags = searchTags.filter((tag) => tag.title !== e.value);
      setTimeout(() => {
        updateSearchTags(newSearchTags);
      }, 100);
    } else {
      const newSearchTags = [...searchTags, e.details];
      setTimeout(() => {
        updateSearchTags(newSearchTags);
      }, 100);
    }
  };

  const onRemoveValue = (tagTitle: string) => {
    const newSearchTags = searchTags.filter((tag) => tag.title !== tagTitle);
    updateSearchTags(newSearchTags);
  };

  const onSearchChange = useCallback(
    (newSearchText?: string) => {
      updateSearchText(newSearchText);
    },
    [searchText]
  );

  const displayTags = useMemo(() => {
    return filters.filterTagsWithCards(tags, cards).map((tag) => {
      return createOption(tag.title, tag);
    });
  }, [tags, cards]);

  const displayValues = useMemo(() => {
    return searchTags.map((tag) => {
      return createOption(tag.title, tag);
    });
  }, [searchTags]);

  return (
    <div className={classes}>
      <MultiSelect
        initialValue={searchText}
        knownOptions={displayTags}
        onSelectOption={onSelectOption}
        onRemoveValue={onRemoveValue}
        placeholder={STR.SEARCH}
        onInputChange={onSearchChange}
        values={displayValues}
      />
    </div>
  );
};

export default GlobalSearch;
