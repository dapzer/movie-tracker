import type {
  GetMediaItemsByListIdQueries,
  MediaItemsCountByStatusQueries,
  MediaItemStatusNameEnum,
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
  currentStatus: MediaItemStatusNameEnum
  isSaveCreationDate: boolean
}

export interface GetMediaItemsByMediaIdApiArgs {
  mediaId: number
  mediaType: MediaTypeEnum
}

export type GetMediaItemsByMediaListIdApiArgs = { mediaListId: string } & Omit<GetMediaItemsByListIdQueries, "mediaListId">

export type GetMediaItemsCountByMediaListIdApiArgs = MediaItemsCountByStatusQueries & { mediaListId: string }

export interface MediaItemBulkCreateApiTypes {
  items: MediaItemCreateApiTypes[]
}

export interface MediaItemBulkDeleteApiTypes {
  ids: string[]
}

export interface MediaItemBulkCreateCloneApiTypes {
  items: Array<MediaItemCreateCloneApiTypes>
}
