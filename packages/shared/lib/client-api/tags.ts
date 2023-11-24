"use client";
import useSWR, { KeyedMutator } from "swr";
import { useSession } from "next-auth/react";
import { postRequest, deleteRequest, patchRequest } from "../util/fetch";
import { SessionUser, TagClass } from "..";
import { apiBaseURL } from "./config";
import { SWRState, fetcher } from "./swr";
import { ObjectId } from "mongoose";

const tagsAPIPath = "/api/tags";
const tagsAPIURL = `${apiBaseURL}${tagsAPIPath}`;

interface UserTagData extends SWRState {
  tags: Array<TagClass>;
  mutate: KeyedMutator<Array<TagClass>>;
}

function useCurrentUserTags(): UserTagData {
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
    tags: data?.tags || data || [],
    mutate,
    isLoading,
    isValidating,
    isError: error
  };
}

async function createTag({
  title,
  cards,
  color
}: {
  title: string;
  cards: Array<string>;
  color?: string;
}) {
  return await postRequest(tagsAPIURL, { title, cards, color });
}

async function updateTag({
  _id,
  cards
}: {
  _id: string | ObjectId;
  cards: Array<string>;
}) {
  if (_id) {
    return await patchRequest(`${tagsAPIURL}/${_id}`, { cards });
  }
}

async function deleteTag({ id }: { id: string }) {
  return await deleteRequest(`${tagsAPIURL}/${id}`);
}

async function deleteAllTags() {
  return await deleteRequest(tagsAPIURL);
}

export { createTag, deleteTag, updateTag, deleteAllTags, useCurrentUserTags };
