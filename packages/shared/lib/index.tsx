import { Card, CardClass } from "./models/Card";
import { Tag, TagClass } from "./models/Tag";
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

import { CONSTANTS } from "./util/constants";
import { translate } from "./translate";

import { UIProvider, UIContext } from "./context/UIProvider";
import {
  TranslationProvider,
  TranslationContext
} from "./context/TranslationProvider";

import { LocalStorageProvider } from "./context/LocalStorageProvider";
import { sorts, filters } from "./util/filter-sort";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

import KEY_CODES from "./util/keys";

export {
  KEY_CODES,
  sorts,
  filters,
  Card,
  CardClass,
  Tag,
  TagClass,
  useCards,
  useCurrentUserCards,
  useCurrentUserTags,
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
