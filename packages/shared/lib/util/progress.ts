import mongoose from "mongoose";
import { CONSTANTS, CardClass } from "..";
import { CARD_PROGRESS } from "../models/UserProfile";

const getCardProgressGroups = (cards: Array<CardClass>, progressMap:any) => {
    const cardsNegativeProgress = cards?.filter((card:CardClass) => {
        let hasNeedsReviewProgress =
          progressMap.get(card._id) === CARD_PROGRESS.NEGATIVE;
        return hasNeedsReviewProgress;
      }) || [];
    
      const cardsNoProgress = cards.filter((card:CardClass) => {
        const hasNoProgress = typeof progressMap.get(card._id) === "undefined";
        return hasNoProgress;
      }) || [];
    
      const cardsPositiveProgress = cards.filter((card:CardClass) => {
        let hasPositiveProgress =
          progressMap.get(card._id) === CARD_PROGRESS.POSITIVE;
        return hasPositiveProgress;
      }) || [];
    
      return {
        cardsNegativeProgress, cardsNoProgress, cardsPositiveProgress
      } 
}

const getItemProgressStatuses = (progressStatuses: Map<mongoose.Types.ObjectId, number>, item:CardClass) => {
    const localMap = new Map(Object.entries(progressStatuses));
    const itemProgress = localMap.get(String(item._id));
    const hasProgress = typeof itemProgress !== CONSTANTS.UNDEFINED;

    const isNegativeProgress = itemProgress === CARD_PROGRESS.NEGATIVE;
    const isPositiveProgress = itemProgress === CARD_PROGRESS.POSITIVE;
    return {
        isNegativeProgress, 
        isPositiveProgress, 
        hasProgress
    }
}

export { getCardProgressGroups, getItemProgressStatuses } 