import type { MediaItemType, MediaRatingType } from "@movie-tracker/types"
import type {
  CreateMediaRatingBody,
  GetMediaRatingByMediaIdArgs,
  GetMediaRatingByUserIdArgs,
  UpdateMediaRatingArgs,
} from "~/api/mediaRating/mediaRatingApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"
import {
  createMediaRating,
  deleteMediaRating,
  getMediaRatingByMediaId,
  getMediaRatingByUserId,
  updateMediaRating,
} from "~/api/mediaRating/mediaRatingApi"
import { MediaRatingApiQueryKeys } from "~/api/mediaRating/mediaRatingApiQueryKeys"

export function useGetMediaRatingByMediaIdApi(args: GetMediaRatingByMediaIdArgs) {
  return useQuery({
    queryKey: [MediaRatingApiQueryKeys.GET_BY_MEDA_ID, args.mediaId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getMediaRatingByMediaId(args, { headers })
    },
    retry: false,
    retryOnMount: false,
  })
}
export function useGetMediaRatingByUserIdApi(args: GetMediaRatingByUserIdArgs) {
  return useQuery({
    queryKey: [MediaRatingApiQueryKeys.GET_ALL_BY_USER_ID, args.userId],
    queryFn: () => {
      return getMediaRatingByUserId(args)
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
      await queryClient.setQueryData([MediaRatingApiQueryKeys.GET_BY_MEDA_ID, data.mediaId, data.mediaType], data)
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
      await queryClient.setQueryData([MediaRatingApiQueryKeys.GET_BY_MEDA_ID, data.mediaId, data.mediaType], data)
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

export function useDeleteMediaRatingApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaRatingApiQueryKeys.DELETE],
    mutationFn: deleteMediaRating,
    onSuccess: async (data, id) => {
      await queryClient.resetQueries({
        queryKey: [MediaRatingApiQueryKeys.GET_BY_MEDA_ID, data.mediaId, data.mediaType],
      })
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        if (oldData) {
          return oldData.map((el) => {
            if (el.mediaRating?.id === id) {
              return {
                ...el,
                mediaRating: undefined,
              }
            }
            return el
          })
        }
      })
    },
  })
}
