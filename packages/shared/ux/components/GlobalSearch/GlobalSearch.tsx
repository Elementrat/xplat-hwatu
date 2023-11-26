"use client";
import React, { useMemo, useContext, useCallback, MouseEvent } from "react";
import { CONSTANTS, UIContext, useCurrentUserCards } from "xplat-lib";
import s from "./GlobalSearch.module.css";
import clsx from "clsx";
import { useCurrentUserTags } from "xplat-lib/client-api/tags";
import { MultiSelect, STR, createOption } from "ux";
import { filters } from "xplat-lib";
import { bookOutline, schoolOutline } from "ionicons/icons";
import { Button } from "ux";
import { useSession } from "next-auth/react";

const GlobalSearch = () => {
  const {
    searchTags,
    searchText,
    updateSearchText,
    updateSearchTags,
    toggleStudyMode,
    studyMode,
    toggleLoginModal
  } = useContext(UIContext);
  const { tags } = useCurrentUserTags();
  const { cards } = useCurrentUserCards();
  const { status } = useSession();

  const classes = clsx({
    [s.globalSearch]: true,
    [s.show]: cards?.length > 0
  });

  const onSelectOption = (e: any) => {
    if (searchTags?.includes(e.value)) {
      const newSearchTags = searchTags?.filter((tag) => tag.title !== e.value);
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
    const newSearchTags = searchTags?.filter((tag) => tag.title !== tagTitle);
    updateSearchTags(newSearchTags);
  };

  const onClearSearch = () => {
    const newSearchTags = [];
    updateSearchTags(newSearchTags);
  };

  const onSearchChange = useCallback(
    (newSearchText?: string) => {
      updateSearchText(newSearchText);
    },
    [searchText]
  );

  const onStudyModeClick = () => {
    if (status === CONSTANTS.AUTHENTICATED) {
      toggleStudyMode();
    }
  };

  const onClickAppControls = (e: MouseEvent<HTMLDivElement>) => {
    if (status !== CONSTANTS.AUTHENTICATED) {
      e.preventDefault();
      toggleLoginModal();
      return false;
    }
  };

  const displayTags = useMemo(() => {
    return filters.filterTagsWithCards(tags, cards)?.map((tag) => {
      return createOption(tag.title, tag);
    });
  }, [tags, cards]);

  const displayValues = useMemo(() => {
    return searchTags?.map((tag) => {
      return createOption(tag.title, tag);
    });
  }, [searchTags, tags]);

  return (
    <div className={s.appControls} onClick={onClickAppControls}>
      <div className={classes}>
        <MultiSelect
          initialValue={searchText}
          knownOptions={displayTags}
          onSelectOption={onSelectOption}
          onRemoveValue={onRemoveValue}
          onClear={onClearSearch}
          placeholder={STR.SEARCH}
          onInputChange={onSearchChange}
          values={displayValues}
          inputValue={searchText}
        />
      </div>
      <div className={s.btns}>
        <Button
          icon={studyMode.active ? bookOutline : schoolOutline}
          fillSpace={true}
          onClick={onStudyModeClick}
          active={studyMode.active}
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
