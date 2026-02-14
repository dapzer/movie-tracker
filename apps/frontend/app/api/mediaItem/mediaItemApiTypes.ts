import type { MediaItemStatusNameEnum, MediaItemTrackingDataType, MediaItemType, MediaTypeEnum } from "@movie-tracker/types"

export interface MediaItemCreateApiTypes {
  mediaListId: string
  mediaType: MediaTypeEnum
  mediaId: number
  currentStatus: MediaItemStatusNameEnum
}

export type MediaItemUpdateApiTypes = Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">>

export interface MediaItemCreateCloneApiTypes {
  mediaItemId: string
  mediaListId: string
  isSaveCreationDate: boolean
}

export interface GetMediaItemsByMediaIdApiArgs {
  mediaId: number
}

export interface MediaItemBulkCreateApiTypes {
  items: MediaItemCreateApiTypes[]
}

export interface MediaItemBulkDeleteApiTypes {
  ids: string[]
}

export interface MediaItemBulkUpdateTrackingDataItemApiTypes {
  trackingDataId: string
  body: MediaItemTrackingDataType
}

export interface MediaItemBulkUpdateTrackingDataApiTypes {
  items: MediaItemBulkUpdateTrackingDataItemApiTypes[]
}
