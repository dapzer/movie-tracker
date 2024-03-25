import { type MediaItemType, MediaTypeEnum } from "@movie-tracker/types";

export interface MediaItemCreateApiTypes {
  mediaListId: string,
  mediaType: MediaTypeEnum,
  mediaId: number
}

export type MediaItemUpdateApiTypes = Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">>

export interface MediaItemCreateCopyApiTypes {
  mediaItemId: string,
  mediaListId: string,
  isSaveCreationDate: boolean
}

