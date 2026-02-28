import type { MediaRatingType } from "@movie-tracker/types"
import type { UseQueryOptions } from "@tanstack/vue-query"
import type { Ref } from "vue"
import type {
  CreateMediaRatingBody,
  DeleteMediaRatingArgs,
  GetMediaRatingByMediaIdArgs,
  GetMediaRatingByUserIdArgs,
  GetRecentlyCreatedMediaRatingsArgs,
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
  getMediaRatingsGetRecentlyCreated,
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

export function useGetMediaRatingByUserIdApi(args: Ref<GetMediaRatingByUserIdArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaRatingApiQueryKeys.GET_ALL_BY_USER_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaRatingByUserId(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useMediaRatingsGetRecentlyCreatedApi(args: Ref<GetRecentlyCreatedMediaRatingsArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaRatingApiQueryKeys.GET_RECENTLY_CREATED, args],
    queryFn: () => {
      return getMediaRatingsGetRecentlyCreated(args.value)
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useCreateMediaRatingApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaRatingApiQueryKeys.CREATE],
    mutationFn: (body: Omit<CreateMediaRatingBody, "mediaDetailsId">) => {
      return createMediaRating(body)
    },
    onSuccess: async (data: MediaRatingType) => {
      await Promise.all([
        queryClient.setQueryData([MediaRatingApiQueryKeys.GET_BY_MEDA_ID, data.mediaId, data.mediaType], data),
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
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
      await Promise.all([
        queryClient.setQueryData([MediaRatingApiQueryKeys.GET_BY_MEDA_ID, data.mediaId, data.mediaType], data),
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}

export function useDeleteMediaRatingApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaRatingApiQueryKeys.DELETE],
    mutationFn: (args: DeleteMediaRatingArgs) => deleteMediaRating(args),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.resetQueries({
          queryKey: [MediaRatingApiQueryKeys.GET_BY_MEDA_ID, data.mediaId, data.mediaType],
        }),
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}
