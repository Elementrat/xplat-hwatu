"use client";
import useSWR from "swr";
import { postRequest, deleteRequest } from "../util/fetch";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const baseURL = "http://localhost:3000";
const cardsAPIPath = "/api/cards";

const cardsAPIURL = `${baseURL}${cardsAPIPath}`;

function useCards() {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cardsAPIURL,
    fetcher,
    {
      keepPreviousData: true
    }
  );
  return {
    cards: data?.cards,
    mutate,
    isLoading,
    isValidating,
    isError: error
  };
}

async function createCard(title: string) {
  return await postRequest(cardsAPIURL, { title });
}

async function deleteCardByID(id: string) {
  return await deleteRequest(`${cardsAPIURL}/${id}`);
}

async function deleteAllCards() {
  return await deleteRequest(cardsAPIURL);
}

export { useCards, createCard, deleteCardByID, deleteAllCards };
