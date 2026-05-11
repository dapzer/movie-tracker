import type { PaginationType, SortOrderEnum } from "../common"
import type { MediaDetailsType } from "./mediaDetails"
import { MediaRatingType } from "./mediaRating"

export enum MediaTypeEnum {
  MOVIE = "movie",
  TV = "tv",
}

export enum MediaItemStatusNameEnum {
  WATCHING_NOW = "WATCHING_NOW",
  NOT_VIEWED = "NOT_VIEWED",
  WAIT_NEW_PART = "WAIT_NEW_PART",
  VIEWED = "VIEWED",
}

export interface MediaItemType {
  id: string
  mediaId: number
  mediaDetailsId: string
  mediaListId: string
  mediaType: MediaTypeEnum
  mediaDetails?: MediaDetailsType
  mediaRating?: MediaRatingType
  trackingData: MediaItemTrackingDataType
  createdAt: Date
  updatedAt: Date
}

export interface MediaItemTrackingDataType {
  id: string
  mediaItemId: string
  currentStatus: MediaItemStatusNameEnum
  note: string
  score: number | null
  tvProgress: MediaItemTvProgressType
  sitesToView: Array<MediaItemSiteToViewType>
  createdAt: Date
  updatedAt: Date
}

export const MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH = 2500

export interface MediaItemTvProgressType {
  currentSeason: number
  currentEpisode: number
}

export interface MediaItemSiteToViewType {
  url: string
}

export interface MediaItemsCountByStatusType {
  [MediaItemStatusNameEnum.WATCHING_NOW]: number
  [MediaItemStatusNameEnum.NOT_VIEWED]: number
  [MediaItemStatusNameEnum.WAIT_NEW_PART]: number
  [MediaItemStatusNameEnum.VIEWED]: number
  total: number
}

export interface MediaItemsFiltersQueries {
  mediaTypes?: MediaTypeEnum[]
  rating?: [number, number]
  releaseYear?: [number | undefined, number | undefined]
  genres?: number[]
  releaseStatuses?: string[]
}

export interface MediaItemsCountByStatusQueries extends MediaItemsFiltersQueries {
  search?: string
}

export interface MediaItemsByListIdResponseType {
  items: MediaItemType[]
  totalCount: number
}

export interface GetMediaItemsByListIdQueries extends PaginationType, MediaItemsFiltersQueries {
  search?: string
  status?: MediaItemStatusNameEnum
  sortBy?: "createdAt" | "updatedAt"
  sortDirection?: SortOrderEnum
}
