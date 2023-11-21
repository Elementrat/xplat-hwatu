import React from 'react';
import styles from "./Heading.module.css";
import clsx from "clsx";

const Heading = ({text}: {text:string}) => {

    const headingStyles = clsx({
        'font-bold': true,
        'text-2xl': true,
        [styles.Heading]: true
    })
    return <div className={headingStyles}>{text}</div>
}

export { Heading };