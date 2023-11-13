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

  return (
    <div>
      <div className="flex align-items-center justify-content-space-between">
        <h2 className="text-md font-bold">
          {STR.TAGS} ({tags?.length})
        </h2>
      </div>
      <div className={styles.userCards}>
        {tags?.map((tag) => {
          const cardKey = tag?.title + "-" + tag?._id;
          return (
            <div key={cardKey} id={cardKey} className={styles.userCard}>
              <div>{tag?.title}</div>
              <div>
                {tag?.cards?.map((card) => {
                  return <div>{card}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { UserTags };
