"use client";

import React from "react";
import { MouseEventHandler } from "react";
import { IonIcon } from "@ionic/react";
import styles from "./Button.module.css";
import clsx from "clsx";

const Button = ({
  primary,
  label,
  icon,
  onClick
}: {
  primary?: boolean;
  label?: string;
  icon?: any;
  onClick?: MouseEventHandler;
}) => {
  const btnStyles = clsx({
    [styles.btn]: true,
    [styles.primary]: primary
  });
  return (
    <button className={btnStyles} onClick={onClick}>
      {icon && <IonIcon icon={icon} size="small" />}
      {label}
    </button>
  );
};

export { Button };
