import type { MediaRatingPaginatedType, MediaRatingType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  CreateMediaRatingBody,
  DeleteMediaRatingArgs,
  GetMediaRatingByMediaIdArgs,
  GetMediaRatingByUserIdArgs,
  GetRecentlyCreatedMediaRatingsArgs,
  UpdateMediaRatingArgs,
} from "~/api/mediaRatings/mediaRatingsApiTypes"
import { api } from "~/api/instance"

export function getMediaRatingByMediaId(args: GetMediaRatingByMediaIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<MediaRatingType>(`media-ratings/by-media/${args.mediaId}`, {
    ...options,
  })
}

export function getMediaRatingByUserId(args: GetMediaRatingByUserIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<MediaRatingPaginatedType>(`media-ratings/by-user-id/${args.userId}`, {
    ...options,
    params: {
      offset: args.offset,
      limit: args.limit,
    },
  })
}

export function getMediaRatingsGetRecentlyCreated(args: GetRecentlyCreatedMediaRatingsArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<MediaRatingPaginatedType>(`media-ratings/recently-created`, {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
    },
  })
}

export function createMediaRating(body: Omit<CreateMediaRatingBody, "mediaDetailsId">, options?: RequestOptions) {
  return api.post<MediaRatingType>("media-ratings", body, options)
}

export function updateMediaRating(args: UpdateMediaRatingArgs, options?: RequestOptions) {
  return api.patch<MediaRatingType>(`media-ratings/${args.id}`, args.body, options)
}

export function deleteMediaRating(args: DeleteMediaRatingArgs, options?: RequestOptions) {
  return api.delete<MediaRatingType>(`media-ratings/${args.id}`, options)
}
