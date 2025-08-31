import type { MediaItemStatusNameEnum, MediaItemType, MediaTypeEnum } from "@movie-tracker/types"

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
