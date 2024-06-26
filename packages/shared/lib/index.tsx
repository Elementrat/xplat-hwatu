import {
  Card,
  CardClass,
  CardAttachment,
} from "./models/Card";
import { Tag, TagClass } from "./models/Tag";
import { UserProfile, UserProfileClass } from "./models/UserProfile";
import {
  useCards,
  createCard,
  deleteCard,
  updateCard,
  useCurrentUserCards
} from "./client-api/cards";

import {
  createTag,
  deleteTag,
  updateTag,
  useCurrentUserTags
} from "./client-api/tags";

import { useCurrentUserProfile } from "./client-api/user-profile";

import { CONSTANTS } from "./util/constants";
import { translate } from "./translate";

import { UIProvider, UIContext } from "./context/UIProvider";
import {
  TranslationProvider,
  TranslationContext
} from "./context/TranslationProvider";

import { LocalStorageProvider } from "./context/LocalStorageProvider";
import { sorts, filters } from "./util/filter-sort";
import { mergeDeep } from "./util/merge";
import { url } from "./util/url"
import  { getCardProgressGroups, getItemProgressStatuses } from "./util/progress"

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

import { KEY_CODES, KEY_NAMES } from "./util/keys";
import {shuffleArray} from "./util/arrays";

export {
  KEY_CODES,
  KEY_NAMES,
  sorts,
  filters,
  url,
  shuffleArray,
  getCardProgressGroups,
  getItemProgressStatuses,
  mergeDeep,
  UserProfile,
  UserProfileClass,
  Card,
  CardClass,
  Tag,
  TagClass,
  useCards,
  useCurrentUserCards,
  useCurrentUserTags,
  useCurrentUserProfile,
  createCard,
  updateCard,
  deleteCard,
  createTag,
  updateTag,
  deleteTag,
  CONSTANTS,
  UIProvider,
  UIContext,
  TranslationProvider,
  TranslationContext,
  LocalStorageProvider,
  translate
};

export type { CardAttachment };
