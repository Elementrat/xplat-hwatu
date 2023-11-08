import { Card, CardClass } from "./models/Card";
import {
  useCards,
  createCard,
  deleteAllCards,
  useCurrentUserCards
} from "./client-api/cards";
import { CONSTANTS } from "./util/constants";

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
  deleteAllCards,
  CONSTANTS
};
