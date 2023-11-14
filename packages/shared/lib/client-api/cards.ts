"use client";
import useSWR, { KeyedMutator } from "swr";
import { useSession } from "next-auth/react";
import { postRequest, deleteRequest, patchRequest } from "../util/fetch";
import { CardClass, SessionUser } from "..";
import { apiBaseURL } from "./config";
import { SWRState, fetcher, fetchConfigs } from "./swr";

const cardsAPIPath = "/api/cards";
const cardsAPIURL = `${apiBaseURL}${cardsAPIPath}`;

function useCards(userID: string) {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${cardsAPIURL}?userID=${userID}`,
    fetcher,
    fetchConfigs.preservePrevious
  );

  return {
    cards: data?.cards,
    mutate,
    isLoading,
    isValidating,
    isError: error
  };
}

interface UserCardData extends SWRState{
  cards: Array<CardClass>,
  mutate: KeyedMutator<Array<CardClass>>,
}

function useCurrentUserCards():UserCardData {
  const { data: session } = useSession();

  let user = session?.user as SessionUser;

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${cardsAPIURL}?userID=${user?.id}`,
    fetcher,
    fetchConfigs.preservePrevious
  );

  return {
    cards: data?.cards || data,
    mutate,
    isLoading,
    isValidating,
    isError: error
  }
}

async function createCard(title: string, sideB: string) {
  return await postRequest(cardsAPIURL, { title, sideB });
}

async function updateCard(card: any) {
  const id = card?.id;
  if (id) {
    return await patchRequest(`${cardsAPIURL}/${id}`, { ...card });
  }
}

async function deleteCard({ id }: { id: string }) {
  return await deleteRequest(`${cardsAPIURL}/${id}`);
}

async function deleteAllCards() {
  return await deleteRequest(cardsAPIURL);
}

export {
  useCards,
  createCard,
  deleteCard,
  updateCard,
  deleteAllCards,
  useCurrentUserCards
};
