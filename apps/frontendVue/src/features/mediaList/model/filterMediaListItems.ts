import type { MediaItemType } from "@movie-tracker/types";
import type { MediaListSortingOptionType } from "~/features/mediaList";

export const filterMediaListItems = (mediaItems: MediaItemType[], searchValue: string, sortModel: MediaListSortingOptionType) => {
  const sortedArray = [...mediaItems].sort((a, b) => {
    const aDate = new Date(a[sortModel.field]);
    const bDate = new Date(b[sortModel.field]);

    if (sortModel.order === "desc") {
      return bDate < aDate ? 1 : -1;
    } else {
      return aDate < bDate ? 1 : -1;
    }
  });

  if (!searchValue) {
    return sortedArray;
  }

  const searchLowerCase = searchValue.toLowerCase();

  const filteredBySearchValue = sortedArray?.filter(item => {
    const mediaDetails = item.mediaDetails;

    const isRuTitle = mediaDetails?.ru.title?.toLowerCase().includes(searchLowerCase);
    const isEnTitle = mediaDetails?.en.title?.toLowerCase().includes(searchLowerCase);
    const isOriginalTitle = mediaDetails?.en.originalTitle?.toLowerCase().includes(searchLowerCase);

    return isRuTitle || isEnTitle || isOriginalTitle;
  });

  return filteredBySearchValue;
};
