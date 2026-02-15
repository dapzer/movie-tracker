import type {
  GetMediaItemsByListIdQueries,
  MediaItemsCountByStatusQueries,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemType,
  MediaTypeEnum,
} from "@movie-tracker/types"

export interface MediaItemCreateApiTypes {
  mediaListId: string
  mediaType: MediaTypeEnum
  mediaId: number
  currentStatus: MediaItemStatusNameEnum
}

export interface MediaItemUpdateApiArgs {
  mediaItemId: string
  body: MediaItemUpdateBodyApiTypes
}

export type MediaItemUpdateBodyApiTypes = Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">>

export interface MediaItemCreateCloneApiTypes {
  mediaItemId: string
  mediaListId: string
  isSaveCreationDate: boolean
}

export interface GetMediaItemsByMediaIdApiArgs {
  mediaId: number
}

export type GetMediaItemsByMediaListIdApiArgs = { mediaListId: string } & Omit<GetMediaItemsByListIdQueries, "mediaListId">

export type GetMediaItemsCountByMediaListIdApiArgs = MediaItemsCountByStatusQueries & { mediaListId: string }

export interface MediaItemTrackingDataUpdateApiArgs {
  trackingDataId: string
  body: MediaItemTrackingDataType
}

export interface MediaItemBulkCreateApiTypes {
  items: MediaItemCreateApiTypes[]
}

export interface MediaItemBulkDeleteApiTypes {
  ids: string[]
}

export interface MediaItemBulkUpdateTrackingDataApiTypes {
  items: MediaItemTrackingDataUpdateApiArgs[]
}
