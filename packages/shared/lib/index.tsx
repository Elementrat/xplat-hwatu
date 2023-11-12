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
import { LocalStorageProvider } from "./context/LocalStorageProvider";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export {
  Card,
  CardClass,
  useCards,
  useCurrentUserCards,
  createCard,
  updateCard,
  deleteCard,
  CONSTANTS,
  UIProvider,
  LocalStorageProvider,
  UIContext,
  translate
};
