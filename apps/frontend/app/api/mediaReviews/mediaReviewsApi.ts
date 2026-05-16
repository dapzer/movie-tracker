import type { MediaReview, MediaReviewDislike, MediaReviewLike, MediaReviewPaginatedType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  CreateMediaReviewBody,
  CreateMediaReviewDislikeBody,
  CreateMediaReviewLikeBody,
  DeleteMediaReviewArgs,
  DeleteMediaReviewDislikeArgs,
  DeleteMediaReviewLikeArgs,
  GetMediaReviewByCurrentUserAndMediaIdArgs,
  GetMediaReviewByIdArgs,
  GetMediaReviewDislikesByReviewIdArgs,
  GetMediaReviewLikesByReviewIdArgs,
  GetMediaReviewsByMediaIdArgs,
  GetMediaReviewsByUserIdArgs,
  GetMediaReviewsListArgs,
  UpdateMediaReviewArgs,
} from "~/api/mediaReviews/mediaReviewsApiTypes"
import { api } from "~/api/instance"

export function getMediaReviewsListApi(args: GetMediaReviewsListArgs, options?: RequestOptions) {
  return api.get<MediaReviewPaginatedType>("media-reviews", {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
      status: args.status,
    },
  })
}

export function getMediaReviewByCurrentUserAndMediaIdApi(args: GetMediaReviewByCurrentUserAndMediaIdArgs, options?: RequestOptions) {
  return api.get<MediaReview | undefined>(`media-reviews/by-current-user-and-media/${args.mediaId}`, options)
}

export function getMediaReviewByIdApi(args: GetMediaReviewByIdArgs, options?: RequestOptions) {
  return api.get<MediaReview>(`media-reviews/${args.id}`, options)
}

export function getMediaReviewsByMediaIdApi(args: GetMediaReviewsByMediaIdArgs, options?: RequestOptions) {
  return api.get<MediaReviewPaginatedType>(`media-reviews/by-media/${args.mediaId}`, {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
    },
  })
}

export function getMediaReviewsByUserIdApi(args: GetMediaReviewsByUserIdArgs, options?: RequestOptions) {
  return api.get<MediaReviewPaginatedType>(`media-reviews/by-user/${args.userId}`, {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
      status: args.status,
    },
  })
}

export function createMediaReviewApi(body: CreateMediaReviewBody, options?: RequestOptions) {
  return api.post<MediaReview>("media-reviews", body, options)
}

export function updateMediaReviewApi(args: UpdateMediaReviewArgs, options?: RequestOptions) {
  return api.patch<MediaReview>(`media-reviews/${args.id}`, args.body, options)
}

export function deleteMediaReviewApi(args: DeleteMediaReviewArgs, options?: RequestOptions) {
  return api.delete<MediaReview>(`media-reviews/${args.id}`, options)
}

export function getMediaReviewLikesByReviewIdApi(args: GetMediaReviewLikesByReviewIdArgs, options?: RequestOptions) {
  return api.get<MediaReviewLike[]>(`media-reviews/${args.reviewId}/likes`, options)
}

export function createMediaReviewLikeApi(body: CreateMediaReviewLikeBody, options?: RequestOptions) {
  return api.post<MediaReviewLike>("media-reviews/likes", body, options)
}

export function deleteMediaReviewLikeApi(args: DeleteMediaReviewLikeArgs, options?: RequestOptions) {
  return api.delete<MediaReviewLike>(`media-reviews/likes/${args.id}`, options)
}

export function getMediaReviewDislikesByReviewIdApi(args: GetMediaReviewDislikesByReviewIdArgs, options?: RequestOptions) {
  return api.get<MediaReviewDislike[]>(`media-reviews/${args.reviewId}/dislikes`, options)
}

export function createMediaReviewDislikeApi(body: CreateMediaReviewDislikeBody, options?: RequestOptions) {
  return api.post<MediaReviewDislike>("media-reviews/dislikes", body, options)
}

export function deleteMediaReviewDislikeApi(args: DeleteMediaReviewDislikeArgs, options?: RequestOptions) {
  return api.delete<MediaReviewDislike>(`media-reviews/dislikes/${args.id}`, options)
}
