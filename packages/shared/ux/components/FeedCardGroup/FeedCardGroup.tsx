import React, {useState} from 'react';
import { Heading } from "../Heading/Heading";

import styles from "./FeedCardGroup.module.css";
import STR from '../../strings/strings';
import { InputCard } from '../InputCard/InputCard';
import { CardClass } from 'xplat-lib';
import { Button } from '../Button/Button';
import { eyeOutline } from "ionicons/icons";

const PAGE_LENGTH = 5;

const FeedCardGroup = ({headingText, cards, progressMap, action}:{headingText:string, cards:CardClass[], progressMap: any, action?: any}) => {
    const [numShown, setNumShown] = useState(PAGE_LENGTH)

    const numCardsInSet = cards?.length;

    const incrementNumShown = () => {
        if (numShown + PAGE_LENGTH < numCardsInSet){
            setNumShown(numShown + PAGE_LENGTH)
        }
        else{
            setNumShown(numCardsInSet);
        }
    }

    const limitedCards = cards?.slice(0, numShown);

    return <>
            {numCardsInSet > 0 && <Heading text={headingText} action={action} />}
            {limitedCards?.map((card) => {
            return (
              card?._id && (
                <InputCard
                  cardID={card?._id}
                  key={card?._id}
                  progressMap={progressMap}
                />
              )
            );
          })}

          {numShown < numCardsInSet && <div className={styles.ShowMore} onClick={incrementNumShown}>
            <div className={styles.ShowMoreBtn}>Showing {`${numShown}/${numCardsInSet}`} </div>
            <Button label={STR.SHOW_MORE} icon={eyeOutline}/>
          </div>}
        </>
}

export { FeedCardGroup };