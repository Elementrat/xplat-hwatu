import React, { useContext } from "react";

import styles from "./DebugInfo.module.css";
import { UIContext } from "xplat-lib";

const DebugInfo = () => {
  const { searchText, searchTags } = useContext(UIContext);
  return (
    <div>
      <span>Search</span>
      <span>Text: {searchText}</span>
      <span>
        Tags:{" "}
        {searchTags?.map((tag) => {
          return <span key={tag.title}>{tag.title}</span>;
        })}
      </span>
    </div>
  );
};

export { DebugInfo };
