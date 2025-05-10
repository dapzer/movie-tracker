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
