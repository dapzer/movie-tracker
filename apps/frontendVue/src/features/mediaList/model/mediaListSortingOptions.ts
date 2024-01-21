import type { MediaItemType } from "@movie-tracker/types";

export interface MediaListSortingOptionType {
  field: keyof Pick<MediaItemType, "createdAt" | "updatedAt">,
  order: "asc" | "desc",
  translationKey: string
}

export const mediaListSortingOptions: MediaListSortingOptionType[] = [
  {
    field: "createdAt",
    order: "asc",
    translationKey: "mediaList.sort.createdAtAsc"
  },
  {
    field: "createdAt",
    order: "desc",
    translationKey: "mediaList.sort.createdAtDesc"
  },
  {
    field: "updatedAt",
    order: "asc",
    translationKey: "mediaList.sort.updatedAtAsc"
  },
  {
    field: "updatedAt",
    order: "desc",
    translationKey: "mediaList.sort.updatedAtDesc"
  }
]
