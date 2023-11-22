import React from "react";
import styles from "./Heading.module.css";
import clsx from "clsx";

const Heading = ({
  text,
  action
}: {
  text: string;
  action?: React.ReactNode;
}) => {
  const headingStyles = clsx({
    [styles.Heading]: true
  });
  return (
    <div className={headingStyles}>
      <div className="text-2xl font-bold">{text}</div>
      {action}
    </div>
  );
};

export { Heading };
