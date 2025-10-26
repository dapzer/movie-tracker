import type { MediaRatingCreateBodyType, MediaRatingUpdateBodyType } from "@movie-tracker/types"

export interface GetMediaRatingByMediaIdArgs {
  mediaId: number
}

export interface GetMediaRatingByUserIdArgs {
  userId: string
}

export type CreateMediaRatingBody = MediaRatingCreateBodyType

export interface UpdateMediaRatingArgs {
  id: string
  body: MediaRatingUpdateBodyType
}

export interface DeleteMediaRatingArgs {
  id: string
}
