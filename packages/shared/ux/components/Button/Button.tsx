import React from 'react';
import { MouseEventHandler } from "react";
import styles from "./Button.module.css";
 
const Button = ({ label, onClick}: {label: string, onClick: MouseEventHandler}) => {
  return <button className={styles.btn} onClick={onClick}>{label}</button>
}

export { Button };