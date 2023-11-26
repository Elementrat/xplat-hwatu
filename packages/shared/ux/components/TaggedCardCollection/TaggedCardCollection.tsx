import React, { useState, useContext, useRef, useEffect } from "react";
import {
  CONSTANTS,
  KEY_CODES,
  UIContext,
  updateTag,
  useCurrentUserTags
} from "xplat-lib";
import styles from "./TaggedCardCollection.module.css";
import { CardClass, TagClass } from "xplat-lib";
import clsx from "clsx";
import { Button } from "../Button/Button";
import {
  trash,
  createOutline,
  saveOutline,
  cloudUploadOutline
} from "ionicons/icons";
import { TextInput } from "../TextInput/TextInput";
import { fetchConfigs } from "xplat-lib/client-api/swr";

const visibleCutoff = 14;

const TaggedCardCollection = ({
  tag,
  cards
}: {
  tag: TagClass;
  cards: Array<CardClass>;
}) => {
  const {
    updateSearchText,
    updateSearchTags,
    searchTags,
    studyMode,
    toggleDeleteTagModal
  } = useContext(UIContext);
  const expand = searchTags?.find((searchTag) => searchTag._id === tag._id);
  const { tags, mutate } = useCurrentUserTags();
  const [editable, setEditable] = useState(false);
  const [localValue, setLocalValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tagColor = tag?.color || "rgba(0,0,0,.2)";

  const showTagControls = tag.title !== CONSTANTS.UNTAGGED && expand;

  const collectionStyles = clsx({
    [styles.expand]: expand,
    [styles.TaggedCardCollection]: true
  });

  const collectionTitleStyles = clsx({
    [styles.collectionTitle]: true
  });

  const titleTextStyles = clsx({
    [styles.tagTitleText]: true,
    [styles.active]: expand,
    "text-md": true,
    "font-bold": true
  });

  const tagControlStyles = clsx({
    [styles.tagControls]: true,
    [styles.active]: expand
  });

  const toggleExpand = () => {
    if (!editable) {
      let newExpandValue = !expand;
      if (!tag._id) {
        if (!searchTags.find((tag) => tag._id === CONSTANTS.UNTAGGED)) {
          updateSearchTags([
            {
              _id: CONSTANTS.UNTAGGED,
              title: CONSTANTS.UNTAGGED
            }
          ]);
          updateSearchText("");
        } else {
          updateSearchTags([]);
          updateSearchText("");
        }
        return;
      }
      if (newExpandValue) {
        updateSearchTags([tag]);
        updateSearchText("");
      } else {
        updateSearchTags([]);
        updateSearchText("");
      }
    }
  };

  const onTrashClick = () => {
    if (tag.title !== CONSTANTS.UNTAGGED) {
      toggleDeleteTagModal();
    }
  };

  const onEditClick = (e) => {
    if (!editable) {
      setEditable(true);
      setLocalValue(tag?.title);
    }
    if (editable) {
      setEditable(false);
    }
    inputRef?.current?.focus();
  };

  const onTagTitleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const onClear = () => {
    setEditable(false);
    setLocalValue(tag?.title);
  };

  const tryUpdateTagTitle = async () => {
    const newTagData = {
      ...tag,
      title: localValue,
      _id: String(tag._id)
    };

    const createResult = await updateTag(newTagData);
    const newOrUpdatedTag = createResult?.data?.tag;
    if (newOrUpdatedTag) {
      const newTags = tags.map((existingTag) => {
        return existingTag?.id === tag._id ? newTagData : existingTag;
      });
      mutate({ tags: newTags }, fetchConfigs.preservePrevious);

      const newSearchTags = searchTags.map((searchTag) => {
        return searchTag?.id === tag._id ? newTagData : searchTag;
      });

      updateSearchTags(newSearchTags);
    }
  };

  const onKeyDownTitleChange = (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      e.preventDefault();
      e.stopPropagation();
      tryUpdateTagTitle();
    }
  };

  useEffect(() => {
    setEditable(false);
  }, [expand]);

  return (
    <div
      className={collectionStyles}
      style={{ borderLeft: `1px solid ${tagColor}` }}
    >
      <div className={collectionTitleStyles}>
        <div className={styles.collectionTitleTextContainer}>
          <TextInput
            ref={inputRef}
            classNames={titleTextStyles}
            value={Boolean(editable) ? localValue : tag?.title}
            editable={editable && showTagControls}
            onChange={onTagTitleChange}
            clearable={true}
            onClearClick={onClear}
            onEditClick={onEditClick}
            showEditBtn={expand && showTagControls}
            onKeyDown={onKeyDownTitleChange}
            onClick={toggleExpand}
          />
          {!expand && (
            <span className={styles.cardCount}>{` (${cards?.length})`}</span>
          )}
        </div>
        {showTagControls && (
          <>
            {!editable && (
              <Button icon={trash} danger={true} onClick={onTrashClick} />
            )}
            {localValue && editable && (
              <Button icon={saveOutline} onClick={tryUpdateTagTitle} />
            )}
          </>
        )}
      </div>
      <div>
        <div className={styles.cards}>
          {cards.map((card) => {
            const onCardClick = () => {
              if (!studyMode.active) {
                updateSearchText(card.title);
              }
            };

            let longString = card.title?.length > visibleCutoff;

            return (
              <div
                key={String(card._id)}
                className={styles.TaggedCard}
                onClick={onCardClick}
              >
                <div className={styles.cardSideA}>
                  {card.title?.slice(0, visibleCutoff)}
                  {longString && "..."}
                </div>
                <div className={styles.cardSideA}> {card.sideB}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { TaggedCardCollection };
