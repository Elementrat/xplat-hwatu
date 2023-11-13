import React, { useState, useRef, useEffect } from "react";

import styles from "./CardTags.module.css";
import { Button } from "../Button/Button";
import { bookmarks } from "ionicons/icons";
import { TextInput } from "ux";
import { add } from "ionicons/icons";
import { KEY_CODES, createTag } from "xplat-lib";
import { useCurrentUserTags, updateTag } from "xplat-lib/client-api/tags";
import STR from "../../strings/strings";

const CardTags = ({ cardID }) => {
  const [showInput, setShowInput] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { tags, mutate } = useCurrentUserTags();

  const cardTags = tags.filter((tag) => tag.cards?.includes(cardID));

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

  const tryCreateTag = async () => {
    const createResult = await createTag({
      title: tagInput,
      cards: cardID ? [cardID] : []
    });
    let newOrUpdatedTag = createResult?.data?.tag;
    if (newOrUpdatedTag) {
      const newTags = [...tags, newOrUpdatedTag];
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

  const onClickedTag = async (clickedTag) => {
    const tagCards = clickedTag?.cards;
    let newTagCards = tagCards?.filter((id) => id !== cardID);

    const newTags = tags.map((tag) => {
      return tag?.id === clickedTag.id
        ? { ...clickedTag, cards: newTagCards }
        : tag;
    });

    updateTag({
      id: clickedTag?.id,
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
  };

  const onInputKeyDown = (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      tryCreateTag();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className={styles.cardTags}>
      <Button icon={bookmarks} />
      <div className={styles.tagList}>
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
        {showInput ? (
          <TextInput
            placeholder={STR.ENTER_TAG}
            ref={inputRef}
            value={tagInput}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
        ) : (
          <Button icon={add} onClick={toggleShowInput} />
        )}
      </div>
    </div>
  );
};

export { CardTags };
