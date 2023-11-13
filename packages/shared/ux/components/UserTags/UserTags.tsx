"use client";
import React from "react";
import styles from "./UserTags.module.css";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { ErrorIndicator } from "../ErrorIndicator/ErrorIndicator";
import { useCurrentUserTags } from "xplat-lib/client-api/tags";
import STR from "../../strings/strings";

const UserTags = () => {
  const { tags, isLoading, isError } = useCurrentUserTags();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorIndicator />;
  }

  const displayTags = tags?.filter((tag) => tag?.cards?.length > 0);

  return (
    <div>
      <div className="flex align-items-center justify-content-space-between">
        <h2 className="text-md font-bold">
          {STR.TAGS} ({displayTags?.length})
        </h2>
      </div>
      <div className={styles.userCards}>
        {displayTags?.map((tag) => {
          const cardKey = tag?.title + "-" + tag?._id;
          return (
            <div key={cardKey} id={cardKey} className={styles.userCard}>
              <div>{tag?.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { UserTags };
