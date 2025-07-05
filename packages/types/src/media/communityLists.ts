import { PaginationType, SortOrderEnum } from "../common"

export interface GetCommunityListsWeekTopQuery extends PaginationType {
  title?: string
  sortBy: "views" | "createdAt" | "updatedAt"
  sortDirection?: SortOrderEnum
}

export interface GetCommunityListsAllTimeTopQuery extends PaginationType {
  title?: string
  sortBy: "likes" | "createdAt" | "updatedAt"
  sortDirection?: SortOrderEnum
}

export interface GetCommunityListsNewestQuery extends PaginationType {
  title?: string
  sortBy: "createdAt" | "updatedAt"
  sortDirection?: SortOrderEnum
}

export interface GetCommunityListsByTitleQuery extends PaginationType {
  title: string
}

export interface GetCommunityListsWithMediaQuery extends PaginationType {
  title?: string
  mediaId: number
}
