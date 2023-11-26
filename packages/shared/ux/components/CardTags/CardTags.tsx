import React, { useRef, useEffect, useMemo } from "react";

import styles from "./CardTags.module.css";
import { TagClass, createTag } from "xplat-lib";
import { useCurrentUserTags, updateTag } from "xplat-lib/client-api/tags";
import { MultiSelect, createOption } from "../MultiSelect/MultiSelect";
import { fetchConfigs } from "xplat-lib/client-api/swr";
import STR from "../../strings/strings";
import { randomColor } from "../../colors/colors";
import { sorts } from "xplat-lib";

const CardTags = ({ cardID }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { tags, mutate } = useCurrentUserTags();

  let cardTags = tags?.filter((tag) => tag.cards?.includes(cardID));
  cardTags = sorts.sortByUpdatedAt(cardTags);

  const tryCreateTag = async (title) => {
    let existingTagWithTitle = tags?.find((tag) => tag.title === title);

    if (!existingTagWithTitle) {
      const createResult = await createTag({
        title,
        cards: cardID ? [cardID] : [],
        color: randomColor()
      });
      let newTag = createResult?.data?.tag as TagClass;
      if (newTag) {
        const newTags = [...tags, newTag];
        mutate(
          { tags: newTags },
          {
            throwOnError: true,
            revalidate: false
          }
        );
      }
    }
  };

  const onSelectOption = async (selectedOption) => {
    let existingTagWithTitle = tags?.find(
      (tag) => tag.title === selectedOption.value
    );

    if (existingTagWithTitle) {
      const newTagListForCard = [...existingTagWithTitle.cards, cardID];

      const updateResult = await updateTag({
        _id: existingTagWithTitle._id,
        cards: newTagListForCard
      });

      const updatedTag = updateResult?.data?.tag as TagClass | null;

      if (updatedTag && existingTagWithTitle) {
        const newTags = tags?.map((tag) => {
          return tag._id !== null && tag?._id === existingTagWithTitle._id
            ? { ...tag, cards: newTagListForCard }
            : tag;
        });
        mutate({ tags: newTags }, fetchConfigs.preservePrevious);
      }
    }
  };

  const onRemoveValue = async (target) => {
    const clickedTag = tags.find((e) => e._id === target._id);

    if (clickedTag?._id) {
      const tagCards = clickedTag?.cards;
      let newTagCards = tagCards?.filter((id) => id !== cardID);


      const newTags = tags?.map((tag) => {
        return tag?._id === clickedTag._id
          ? { ...tag, cards: newTagCards }
          : tag;
      });

      updateTag({
        _id: clickedTag?._id,
        cards: newTagCards
      });

      mutate({ tags: newTags }, fetchConfigs.preservePrevious);
    }
  };

  const onCreateOption = (title) => {
    tryCreateTag(title);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const dataListOptions = useMemo(() => {
    const results = tags?.map((tag) => {
      return createOption(tag.title, tag);
    });
    return results;
  }, [tags]);

  const cardTagValues = cardTags?.map((tag) => {
    return createOption(tag.title, tag);
  });

  return (
    <div className={styles.cardTags}>
      <div className={styles.tagList}>
        <MultiSelect
          placeholder={STR.TAGS}
          createable={true}
          values={cardTagValues}
          knownOptions={dataListOptions}
          onSelectOption={onSelectOption}
          onCreate={onCreateOption}
          onRemoveValue={onRemoveValue}
        />
      </div>
    </div>
  );
};

export { CardTags };
