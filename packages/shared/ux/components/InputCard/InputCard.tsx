"use client"

import React, { useState } from 'react';
import styles from "./InputCard.module.css";
import { useCards, createCard } from "xplat-lib";

const placeholder = "new card"

const KEY_CODES = {
    ENTER: 13
}

const InputCard = () => {
    const [cardText, setCardText] = useState('');
    const { cards, mutate } = useCards();

    const onInputChange = (e) => {
       setCardText(e.target.value);
    }

    const onKeyDown = async (e) => {
        if(e.keyCode === KEY_CODES.ENTER){

            const createResult = await createCard(cardText);
            const newCardAPI = createResult?.data?.card;
            const newCards = [...cards, newCardAPI];
            console.log("__NEW_CARD_API", newCards)

            mutate({cards: newCards}, {
                throwOnError: true,
                revalidate: false
            })

            setCardText('')
        }
    }

    return (<div className={styles.InputCard}>
            <input type="text" placeholder={placeholder} onChange={onInputChange} onKeyDown={onKeyDown} value={cardText}/>
        </div>)
}

export { InputCard };