import type {
  MediaReviewCreateBodyType,
  MediaReviewDislikeCreateBodyType,
  MediaReviewLikeCreateBodyType,
  MediaReviewStatus,
  MediaReviewUpdateBodyType,
  PaginationType,
} from "@movie-tracker/types"

export interface GetMediaReviewByCurrentUserAndMediaIdArgs {
  mediaId: number
}

export interface GetMediaReviewByIdArgs {
  id: string
}

export type GetMediaReviewsByMediaIdArgs = {
  mediaId: number
  status?: MediaReviewStatus
} & PaginationType

export type GetMediaReviewsByUserIdArgs = {
  userId: string
  status?: MediaReviewStatus
} & PaginationType

export type CreateMediaReviewBody = Omit<MediaReviewCreateBodyType, "mediaDetailsId">

export interface UpdateMediaReviewArgs {
  id: string
  body: Partial<MediaReviewUpdateBodyType>
}

export interface DeleteMediaReviewArgs {
  id: string
}

export interface GetMediaReviewLikesByReviewIdArgs {
  reviewId: string
}

export type CreateMediaReviewLikeBody = Omit<MediaReviewLikeCreateBodyType, "mediaDetailsId">

export interface DeleteMediaReviewLikeArgs {
  id: string
}

export interface GetMediaReviewDislikesByReviewIdArgs {
  reviewId: string
}

export type CreateMediaReviewDislikeBody = Omit<MediaReviewDislikeCreateBodyType, "mediaDetailsId">

export interface DeleteMediaReviewDislikeArgs {
  id: string
}
