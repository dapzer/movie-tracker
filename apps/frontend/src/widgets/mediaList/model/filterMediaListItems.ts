import type { MediaItemType, SortOrderEnum } from "@movie-tracker/types"
import { getSortedArrayByDate } from "~/shared/utils/getSortedArrayByDate"

export function filterMediaListItems(mediaItems: MediaItemType[], searchValue: string, sortOrder: SortOrderEnum, sortBy: keyof Pick<MediaItemType, "createdAt" | "updatedAt">) {
  const sortedArray = getSortedArrayByDate(mediaItems, sortOrder, `trackingData.${sortBy}`)

  if (!searchValue) {
    return sortedArray
  }

  const searchLowerCase = searchValue.toLowerCase()

  const filteredBySearchValue = sortedArray?.filter((item) => {
    const mediaDetails = item.mediaDetails

    const isRuTitle = mediaDetails?.ru.title?.toLowerCase().includes(searchLowerCase)
    const isEnTitle = mediaDetails?.en.title?.toLowerCase().includes(searchLowerCase)
    const isOriginalTitle = mediaDetails?.en.originalTitle?.toLowerCase().includes(searchLowerCase)

    return isRuTitle || isEnTitle || isOriginalTitle
  })

  return filteredBySearchValue
}
