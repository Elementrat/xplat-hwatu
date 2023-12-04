import React from "react";
import styles from "./AppRoot.module.css";
import clsx from "clsx";
import { colorRange } from "@heyeso/color-range";

const AppRoot = ({ children }) => {
  const appRootStyles = clsx({
    [styles.appRoot]: true
  });

  const test_colors = [
    [255, 36, 0],
    [255, 255, 255]
  ];

  const test_ranges = [0, 100];
  const temperatureMap = colorRange(test_colors, test_ranges);
  const temp100 = temperatureMap.getColor(10);
  const temp200 = temperatureMap.getColor(20);
  const temp300 = temperatureMap.getColor(30);
  const temp400 = temperatureMap.getColor(40);
  const temp500 = temperatureMap.getColor(50);
  const temp600 = temperatureMap.getColor(60);
  const temp700 = temperatureMap.getColor(70);
  const temp800 = temperatureMap.getColor(80);
  const temp850 = temperatureMap.getColor(80);
  const temp900 = temperatureMap.getColor(90);
  const temp950 = temperatureMap.getColor(95);

  const style = {
    "--grey-100": temp100?.toHex,
    "--grey-200": temp200?.toHex,
    "--grey-300": temp300?.toHex,
    "--grey-400": temp400?.toHex,
    "--grey-500": temp500?.toHex,
    "--grey-600": temp600?.toHex,
    "--grey-700": temp700?.toHex,
    "--grey-800": temp800?.toHex,
    "--grey-850": temp850?.toHex,
    "--grey-900": temp900?.toHex,
    "--grey-950": temp950?.toHex
  } as React.CSSProperties;

  return (
    <div className={appRootStyles} style={style}>
      {children}
    </div>
  );
};

export { AppRoot };
