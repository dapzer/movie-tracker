import type { MediaRatingCreateBodyType, MediaRatingUpdateBodyType, MediaTypeEnum } from "@movie-tracker/types"

export interface GetMediaRatingByUserArgs {
  mediaId: number
  mediaType: MediaTypeEnum
}

export type CreateMediaRatingBody = MediaRatingCreateBodyType

export interface UpdateMediaRatingArgs {
  id: string
  body: MediaRatingUpdateBodyType
}
