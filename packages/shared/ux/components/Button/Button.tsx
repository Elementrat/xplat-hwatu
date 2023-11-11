"use client";

import React from "react";
import { MouseEventHandler } from "react";
import { IonIcon } from "@ionic/react";
import styles from "./Button.module.css";

const Button = ({
  label,
  icon,
  onClick
}: {
  label?: string;
  icon?: any;
  onClick?: MouseEventHandler;
}) => {
  return (
    <button className={styles.btn} onClick={onClick}>
      {icon && <IonIcon icon={icon} size="small" />}
      {label}
    </button>
  );
};

export { Button };
