import { PaginationType, SortOrderEnum } from "../common"

export interface GetCommunityListsWeekTopQueries extends PaginationType {
  title?: string
  sortBy?: "views" | "createdAt" | "updatedAt"
  sortDirection?: SortOrderEnum
}

export interface GetCommunityListsAllTimeTopQueries extends PaginationType {
  title?: string
  sortBy?: "likes" | "createdAt" | "updatedAt"
  sortDirection?: SortOrderEnum
}

export interface GetCommunityListsNewestQueries extends PaginationType {
  title?: string
  sortBy?: "createdAt" | "updatedAt"
  sortDirection?: SortOrderEnum
}

export interface GetCommunityListsSearchQueries extends PaginationType {
  title: string
}

export interface GetCommunityListsWithMediaQueries extends PaginationType {
  title?: string
  mediaId: number
}
