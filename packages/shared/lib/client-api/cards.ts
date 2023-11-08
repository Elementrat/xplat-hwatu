"use client";
import useSWR from "swr";
import { Capacitor } from "@capacitor/core";
import { useSession } from "next-auth/react";
import { postRequest, deleteRequest } from "../util/fetch";
import { SessionUser } from "..";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const WEB_ENVIRONMENTS = {
  DEV: "development",
  PROD: "production"
};

const baseURLS = {
  LOCAL: "http://localhost:3000",
  PROD: "https://xplat-hwatu-web.vercel.app"
};

const apiBaseURL = Capacitor.isNativePlatform()
  ? baseURLS.PROD
  : process.env.NODE_ENV === WEB_ENVIRONMENTS.DEV
  ? baseURLS.LOCAL
  : baseURLS.PROD;

const cardsAPIPath = "/api/cards";
const cardsAPIURL = `${apiBaseURL}${cardsAPIPath}`;

function useCards(userID: string) {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${cardsAPIURL}?userID=${userID}`,
    fetcher,
    {
      keepPreviousData: true
    }
  );

  return {
    cards: data?.cards || [],
    mutate,
    isLoading,
    isValidating,
    isError: error
  };
}

function useCurrentUserCards() {
  const { data: session } = useSession();

  let user = session?.user as SessionUser;

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${cardsAPIURL}?userID=${user?.id}`,
    fetcher,
    {
      keepPreviousData: true
    }
  );

  return {
    cards: data?.cards || [],
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

export {
  useCards,
  createCard,
  deleteCardByID,
  deleteAllCards,
  useCurrentUserCards
};
