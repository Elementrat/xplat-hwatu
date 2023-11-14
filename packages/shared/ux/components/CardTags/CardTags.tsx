import React, { useState, useRef, useEffect } from "react";

import styles from "./CardTags.module.css";
import { Button } from "../Button/Button";
import { bookmarks } from "ionicons/icons";
import { TextInput } from "ux";
import { add } from "ionicons/icons";
import { KEY_CODES, createTag } from "xplat-lib";
import { useCurrentUserTags, updateTag } from "xplat-lib/client-api/tags";
import { MultiSelect } from "../MultiSelect/MultiSelect";
import STR from "../../strings/strings";

const CardTags = ({ cardID }) => {
  const [showInput, setShowInput] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { tags, mutate } = useCurrentUserTags();

  const cardTags = tags?.filter((tag) => tag.cards?.includes(cardID));

  const toggleShowInput = () => {
    setShowInput(!showInput);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  };

  const onInputChange = (e) => {
    if (e.target) {
      setTagInput(e.target.value);
    }
  };

  const tryCreateTag = async (title) => {
    let existingTagWithTitle = tags?.find((tag) => tag.title === title);

    if (!existingTagWithTitle) {
      const createResult = await createTag({
        title,
        cards: cardID ? [cardID] : []
      });
      let newTag = createResult?.data?.tag;
      if (newTag) {
        const newTags = [...tags, newTag];
        mutate(
          { tags: newTags },
          {
            throwOnError: true,
            revalidate: false
          }
        );
        setTagInput("");
      }
    }
  };

  const onSelectOption = async (selectedOption) => {
    let existingTagWithTitle = tags?.find(
      (tag) => tag.title === selectedOption.value
    );

    const newTagListForCard = [...existingTagWithTitle.cards, cardID];

    const updateResult = await updateTag({
      _id: existingTagWithTitle._id,
      cards: newTagListForCard
    });

    const updatedTag = updateResult?.data?.tag;

    if (updatedTag) {
      const newTags = tags.map((tag) => {
        return tag?._id === existingTagWithTitle._id
          ? { ...tag, cards: newTagListForCard }
          : tag;
      });
      mutate(
        { tags: newTags },
        {
          throwOnError: true,
          revalidate: false
        }
      );
    }
  };

  const onRemoveValue = async (target) => {
    console.log("__ON_REMOVE", target);

    const clickedTag = tags.find((e) => e.title === target);

    if (clickedTag?._id) {
      const tagCards = clickedTag?.cards;
      let newTagCards = tagCards?.filter((id) => id !== cardID);

      const newTags = tags.map((tag) => {
        return tag?._id === clickedTag._id
          ? { ...tag, cards: newTagCards }
          : tag;
      });

      updateTag({
        _id: clickedTag?._id,
        cards: newTagCards
      });

      mutate(
        { tags: newTags },
        {
          throwOnError: true,
          revalidate: false
        }
      );

      setTagInput("");
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

  const dataListOptions = tags?.map((tag) => {
    return { label: tag.title, value: tag.title };
  });

  const cardTagValues = cardTags.map((tag) => {
    return { label: tag.title, value: tag.title };
  });

  /*
          {cardTags?.map((tag) => {
          return (
            <div
              className={styles.cardTag}
              onClick={() => onClickedTag(tag)}
              key={tag.title}
            >
              <span className={styles.hashTag}>#</span>
              {tag.title}
            </div>
          );
        })}
        */
  return (
    <div className={styles.cardTags}>
      <div className={styles.tagList}>
        <MultiSelect
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
