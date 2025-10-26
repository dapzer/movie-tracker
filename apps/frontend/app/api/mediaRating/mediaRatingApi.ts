import type { MediaRatingType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  CreateMediaRatingBody,
  DeleteMediaRatingArgs,
  GetMediaRatingByMediaIdArgs,
  GetMediaRatingByUserIdArgs,
  UpdateMediaRatingArgs,
} from "~/api/mediaRating/mediaRatingApiTypes"
import { api } from "~/api/instance"

export function getMediaRatingByMediaId(args: GetMediaRatingByMediaIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<MediaRatingType>(`media-rating/by-media/${args.mediaId}`, {
    ...options,
  })
}

export function getMediaRatingByUserId(args: GetMediaRatingByUserIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<MediaRatingType[]>(`media-rating`, {
    ...options,
    params: {
      userId: args.userId,
    },
  })
}

export function createMediaRating(body: CreateMediaRatingBody, options?: RequestOptions) {
  return api.post<MediaRatingType>("media-rating", body, options)
}

export function updateMediaRating(args: UpdateMediaRatingArgs, options?: RequestOptions) {
  return api.patch<MediaRatingType>(`media-rating/${args.id}`, args.body, options)
}

export function deleteMediaRating(args: DeleteMediaRatingArgs, options?: RequestOptions) {
  return api.delete<MediaRatingType>(`media-rating/${args.id}`, options)
}
