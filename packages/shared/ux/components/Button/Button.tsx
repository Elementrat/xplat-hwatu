"use client";

import React from "react";
import { MouseEventHandler } from "react";
import { IonIcon } from "@ionic/react";
import styles from "./Button.module.css";
import clsx from "clsx";

const Button = ({
  primary,
  danger,
  label,
  icon,
  onClick,
  fillSpace,
  active,
  size
}: {
  fillSpace?: boolean;
  primary?: boolean;
  danger?: boolean;
  label?: string;
  icon?: any;
  onClick?: MouseEventHandler;
  active?: boolean;
  size?: string;
}) => {
  const btnStyles = clsx({
    [styles.btn]: true,
    [styles.primary]: primary,
    [styles.danger]: danger,
    [styles.fillSpace]: fillSpace,
    [styles.active]: active
  });
  return (
    <button className={btnStyles} onClick={onClick}>
      {icon && <IonIcon icon={icon} size={size || "small"} />}
      {label}
    </button>
  );
};

export { Button };
