import { CardClass, TagClass } from "..";

const sortByCreatedDate = (cards: Array<any>) => {
  const cardsSortedNewestFirst =
    cards &&
    [...cards]?.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
  return cardsSortedNewestFirst;
};

const filterBySearchText = (cards: Array<any>, searchText?: string) => {
  if (!searchText) {
    return cards;
  }
  let displayCards = cards;
  let searchTextLowerCase = searchText?.toLowerCase();

  if (searchTextLowerCase && displayCards?.length) {
    displayCards = displayCards?.filter((card) => {
      const sideALowerCase = card?.title?.toLowerCase();
      const sideBLowerCase = card?.sideB?.toLowerCase();
      return (
        sideALowerCase?.includes(searchTextLowerCase) ||
        sideBLowerCase?.includes(searchTextLowerCase)
      );
    });
  }
  return displayCards;
};

const filterCardsBySearchTags = (
  cards: Array<CardClass>,
  searchTags: Array<TagClass>
) => {
  if (!searchTags.length) {
    return cards;
  }
  let displayCards = cards.filter((card) => {
    let matchingTag = searchTags.find((searchTag) =>
      searchTag.cards.includes(card._id as any)
    );
    return Boolean(matchingTag);
  });

  return displayCards;
};

const filterTagsWithCards = (
  tags: Array<TagClass>,
  cards: Array<CardClass>
) => {
  let prelimResults = tags?.filter((t) => t?.cards?.length > 0);

  let tagsWithCorrespondingCard = prelimResults?.filter((t) => {
    let matchingCardFound = cards.find((card) =>
      t.cards.includes(card._id as any)
    );
    if (matchingCardFound) {
      return true;
    }
  });

  return tagsWithCorrespondingCard;
};

const sorts = {
  sortByCreatedDate
};

const filters = {
  filterBySearchText,
  filterTagsWithCards,
  filterCardsBySearchTags
};

export { sorts, filters };
