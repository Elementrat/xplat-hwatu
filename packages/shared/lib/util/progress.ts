import mongoose from "mongoose";
import { CONSTANTS, CardClass } from "..";
import { CARD_PROGRESS } from "../models/UserProfile";

const getCardProgressGroups = (cards: Array<CardClass>, progressMap:any) => {
  
  if (!progressMap){
    return {cardsNegativeProgress: [], cardsPositiveProgress: [], cardsNoProgress : []}
  }
  
  const cardsNegativeProgress = cards?.filter((card:CardClass) => {
    if (!card || !card._id || !cards) {
      return  {
        isNegativeProgress: false,
        isPositiveProgress: false,
        hasProgress: false
      }
    }

      let hasNeedsReviewProgress =
          progressMap.get(card?._id) === CARD_PROGRESS.NEGATIVE;
        return hasNeedsReviewProgress;
      }) || [];
    
      const cardsNoProgress = cards?.filter((card:CardClass) => {
        if(!card) return;
        const hasNoProgress = typeof progressMap.get(card._id) === "undefined";
        return hasNoProgress;
      }) || [];
    
      const cardsPositiveProgress = cards?.filter((card:CardClass) => {
        if(!card) return;
        let hasPositiveProgress =
          progressMap.get(card._id) === CARD_PROGRESS.POSITIVE;
        return hasPositiveProgress;
      }) || [];
    
      return {
        cardsNegativeProgress, cardsNoProgress, cardsPositiveProgress
      } 
}

const getItemProgressStatuses = (progressStatuses: Map<mongoose.Types.ObjectId, number>, item:CardClass) => {
  if (!progressStatuses || !item) {
    return  {
      isNegativeProgress: false,
      isPositiveProgress: false,
      hasProgress: false
    }
  }

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