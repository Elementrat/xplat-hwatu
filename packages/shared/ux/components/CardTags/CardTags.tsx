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

  const tryCreateTag = async (dirtyTagTitle) => {
    let existingTagWithTitle = tags?.find(
      (tag) => tag.title === dirtyTagTitle || tagInput
    );
    console.log("EXIST", dirtyTagTitle, existingTagWithTitle);

    if (!existingTagWithTitle) {
      const createResult = await createTag({
        title: tagInput,
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
    } else {
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
    }
  };

  const onClickedTag = async (clickedTag) => {
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

  const onInputKeyDown = (e) => {
    // keycode is undefined if the event was from the datalist
    if (e.keyCode === KEY_CODES.ENTER || !e.keyCode) {
      console.log("__E", e.target.value);
      tryCreateTag(e.target.value);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const dataListOptions = tags?.map((tag) => tag.title)?.slice(0, 3);

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
          <>
            <TextInput
              placeholder={STR.ENTER_TAG}
              ref={inputRef}
              value={tagInput}
              onChange={onInputChange}
              onKeyDown={onInputKeyDown}
              inputID={cardID}
              dataListOptions={dataListOptions}
            />
          </>
        ) : (
          <Button icon={add} onClick={toggleShowInput} />
        )}
      </div>
    </div>
  );
};

export { CardTags };
