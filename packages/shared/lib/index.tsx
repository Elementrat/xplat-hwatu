import { Card, CardClass } from "./models/Card";
import {
  useCards,
  createCard,
  deleteCard,
  updateCard,
  useCurrentUserCards
} from "./client-api/cards";
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

export {
  sorts,
  filters,
  Card,
  CardClass,
  useCards,
  useCurrentUserCards,
  createCard,
  updateCard,
  deleteCard,
  CONSTANTS,
  UIProvider,
  UIContext,
  TranslationProvider,
  TranslationContext,
  LocalStorageProvider,
  translate
};
