import type { MediaRatingType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  CreateMediaRatingBody,
  GetMediaRatingByUserArgs,
  UpdateMediaRatingArgs,
} from "~/api/mediaRating/mediaRatingApiTypes"
import { api } from "~/api/instance"

export function getMediaRatingByUser(args: GetMediaRatingByUserArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<MediaRatingType>(`media-rating/by-media/${args.mediaId}`, {
    ...options,
  })
}

export function createMediaRating(body: CreateMediaRatingBody, options?: RequestOptions) {
  return api.post<MediaRatingType>("media-rating", body, options)
}

export function updateMediaRating(args: UpdateMediaRatingArgs, options?: RequestOptions) {
  return api.patch<MediaRatingType>(`media-rating/${args.id}`, args.body, options)
}

export function deleteMediaRating(id: string, options?: RequestOptions) {
  return api.delete<MediaRatingType>(`media-rating/${id}`, options)
}
