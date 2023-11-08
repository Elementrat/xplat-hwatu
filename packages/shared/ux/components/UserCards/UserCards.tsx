import React from "react";
import styles from "./UserCards.module.css";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { ErrorIndicator } from "../ErrorIndicator/ErrorIndicator";
import {
  deleteAllCards,
  useCurrentUserCards
} from "xplat-lib/client-api/cards";
import { Button } from "../Button/Button";

const UserCards = () => {
  const { cards, isLoading, isError, mutate } = useCurrentUserCards();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorIndicator />;
  }

  const onClickDeleteAll = async () => {
    await deleteAllCards();
    mutate([], {
      revalidate: true
    });
  };

  return (
    <div>
      <Button onClick={onClickDeleteAll} label="DEL" />
      {cards?.map((card) => {
        const cardKey = card?.title + "-" + card?._id;
        return (
          <div key={cardKey} id={cardKey}>
            {" "}
            {card?.title}
          </div>
        );
      })}
    </div>
  );
};

export { UserCards };
