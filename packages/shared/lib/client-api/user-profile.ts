"use client";
import useSWR, { KeyedMutator } from "swr";
import { useSession } from "next-auth/react";
import { patchRequest } from "../util/fetch";
import { SessionUser } from "..";
import { apiBaseURL } from "./config";
import { SWRState, fetcher, fetchConfigs } from "./swr";
import { UserProfileClass } from "../models/UserProfile";

const userProfileAPIPath = "/api/user-profile";
const userProfileAPIURL = `${apiBaseURL}${userProfileAPIPath}`;

interface UserProfileData extends SWRState {
  userProfile: UserProfileClass;
  mutate: KeyedMutator<UserProfileData>;
}

function useCurrentUserProfile(): UserProfileData {
  const { data: session } = useSession();

  let user = session?.user as SessionUser;

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${userProfileAPIURL}/${user?.id}`,
    fetcher,
    fetchConfigs.preservePrevious
  );

  return {
    userProfile: data?.userProfile || data,
    mutate,
    isLoading,
    isValidating,
    isError: error
  };
}

async function updateUserProfile(profile: any) {
  return await patchRequest(`${userProfileAPIURL}`, { ...profile });
}

export { updateUserProfile, useCurrentUserProfile };
