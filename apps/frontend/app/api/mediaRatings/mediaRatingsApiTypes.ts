import type { MediaRatingCreateBodyType, MediaRatingUpdateBodyType, PaginationType } from "@movie-tracker/types"

export interface GetMediaRatingByMediaIdArgs {
  mediaId: number
}

export type GetMediaRatingByUserIdArgs = {
  userId: string
} & PaginationType

export type GetRecentlyCreatedMediaRatingsArgs = PaginationType

export type CreateMediaRatingBody = MediaRatingCreateBodyType

export interface UpdateMediaRatingArgs {
  id: string
  body: MediaRatingUpdateBodyType
}

export interface DeleteMediaRatingArgs {
  id: string
}
