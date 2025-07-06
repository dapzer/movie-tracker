import { MediaListsPaginatedType, SortOrderEnum } from "@movie-tracker/types"

export const CommunityListsRepositorySymbol = Symbol("communityListsRepository")

interface DefaultArgs {
  limit: number
  offset: number
  currentUserId?: string
  sortDirection?: SortOrderEnum
  title?: string
}

export interface CommunityListsRepositoryInterface {
  getSearchResult: (args: Omit<DefaultArgs, "sortDirection">) => Promise<MediaListsPaginatedType>
  getWeakTop: (args: { fromDate: Date, sortBy: "views" | "createdAt" | "updatedAt" } & DefaultArgs) => Promise<MediaListsPaginatedType>
  getAllTimeTop: (args: { sortBy: "likes" | "createdAt" | "updatedAt" } & DefaultArgs) => Promise<MediaListsPaginatedType>
  getNewest: (args: { sortBy: "createdAt" | "updatedAt" } & DefaultArgs) => Promise<MediaListsPaginatedType>
  getListsWithMedia: (args: { mediaId: number } & Omit<DefaultArgs, "sortDirection">) => Promise<MediaListsPaginatedType>
}
