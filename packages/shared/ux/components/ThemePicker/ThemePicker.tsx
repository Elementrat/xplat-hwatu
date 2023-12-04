"use client";
import React from "react";
import styles from "./ThemePicker.module.css";
import {
  useCurrentUserProfile,
  updateUserProfile
} from "xplat-lib/client-api/user-profile";
import { fetchConfigs } from "xplat-lib/client-api/swr";

const themeColors = [
  "#15171a",
  "#3f774e",
  "#3f6f61",
  "#3f656f",
  "#455b7b",
  "#5a547b",
  "#6c4b7b",
  "#7b417b",
  "#7d486d",
  "#7c515d",
  "#7d5a4b"
];

const ThemePicker = () => {
  const { userProfile, mutate: mutateUserProfile } = useCurrentUserProfile();

  const onClickColor = (color) => {
    let newColor = color === "#15171a" ? null : color;
    mutateUserProfile(
      {
        ...userProfile,
        themeColorPreference: newColor
      },
      fetchConfigs.preservePrevious
    );
    updateUserProfile({ themeColorPreference: newColor });
  };

  return (
    <div className={styles.ThemePicker}>
      <div className={styles.ThemePickerTitle}>Choose a Theme</div>
      <div className={styles.ThemeColors}>
        {themeColors.map((color) => {
          return (
            <div
              className={styles.themeColor}
              style={{ backgroundColor: color }}
              onClick={() => {
                onClickColor(color);
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export { ThemePicker };
