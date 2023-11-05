"use client"

import React from 'react';
import styles from "./InputCard.module.css";

const placeholder = "new card"

const InputCard = () => {
    const onInputChange = (e) => {
        console.log(e)
    }

    return (<div className={styles.InputCard}>
            <input type="text" placeholder={placeholder} onChange={onInputChange}/>
        </div>)
}

export { InputCard };