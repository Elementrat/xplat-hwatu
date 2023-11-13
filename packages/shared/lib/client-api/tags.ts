"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { postRequest, deleteRequest, patchRequest } from "../util/fetch";
import { SessionUser } from "..";
import { apiBaseURL } from "./config";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const tagsAPIPath = "/api/tags";
const tagsAPIURL = `${apiBaseURL}${tagsAPIPath}`;

function useTags(userID: string) {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${tagsAPIURL}?userID=${userID}`,
    fetcher,
    {
      keepPreviousData: true
    }
  );

  return {
    tags: data?.tags,
    mutate,
    isLoading,
    isValidating,
    isError: error
  };
}

function useCurrentUserTags() {
  const { data: session } = useSession();

  let user = session?.user as SessionUser;

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${tagsAPIURL}?userID=${user?.id}`,
    fetcher,
    {
      keepPreviousData: true
    }
  );

  return {
    tags: data?.tags || data,
    mutate,
    isLoading,
    isValidating,
    isError: error
  };
}

async function createTag({
  title,
  cards
}: {
  title: string;
  cards: Array<string>;
}) {
  return await postRequest(tagsAPIURL, { title, cards });
}

async function updateTag({ id, cards }: { id: string; cards: Array<string> }) {
  if (id) {
    return await patchRequest(`${tagsAPIURL}/${id}`, { cards });
  }
}

async function deleteTag({ id }: { id: string }) {
  return await deleteRequest(`${tagsAPIURL}/${id}`);
}

async function deleteAllTags() {
  return await deleteRequest(tagsAPIURL);
}

export {
  useTags,
  createTag,
  deleteTag,
  updateTag,
  deleteAllTags,
  useCurrentUserTags
};
