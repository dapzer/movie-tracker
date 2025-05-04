import type { MediaItemType, MediaRatingType } from "@movie-tracker/types"
import type {
  CreateMediaRatingBody,
  GetMediaRatingByUserArgs,
  UpdateMediaRatingArgs,
} from "~/api/mediaRating/mediaRatingApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"
import { createMediaRating, getMediaRatingByUser, updateMediaRating } from "~/api/mediaRating/mediaRatingApi"
import { MediaRatingApiQueryKeys } from "~/api/mediaRating/mediaRatingApiQueryKeys"

export function useGetMediaRatingByUserApi(args: GetMediaRatingByUserArgs) {
  return useQuery({
    queryKey: [MediaRatingApiQueryKeys.GET_BY_USER, args.mediaId, args.mediaType],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getMediaRatingByUser(args, { headers })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useCreateMediaRatingApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaRatingApiQueryKeys.CREATE],
    mutationFn: (body: CreateMediaRatingBody) => {
      return createMediaRating(body)
    },
    onSuccess: async (data: MediaRatingType) => {
      await queryClient.setQueryData([MediaRatingApiQueryKeys.GET_BY_USER, data.mediaId, data.mediaType], data)
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        if (oldData) {
          return oldData.map((el) => {
            if (el.mediaId === data.mediaId && el.mediaType === data.mediaType) {
              return {
                ...el,
                mediaRating: data,
              }
            }
            return el
          })
        }
      })
    },
  })
}

export function useUpdateMediaRatingApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaRatingApiQueryKeys.UPDATE],
    mutationFn: (args: UpdateMediaRatingArgs) => {
      return updateMediaRating(args)
    },
    onSuccess: async (data: MediaRatingType) => {
      await queryClient.setQueryData([MediaRatingApiQueryKeys.GET_BY_USER, data.mediaId, data.mediaType], data)
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        if (oldData) {
          return oldData.map((el) => {
            if (el.mediaId === data.mediaId && el.mediaType === data.mediaType) {
              return {
                ...el,
                mediaRating: data,
              }
            }
            return el
          })
        }
      })
    },
  })
}
