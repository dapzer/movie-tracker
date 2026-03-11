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
} from "~/api/mediaRatings/mediaRatingsApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { MediaItemsQueryKeys } from "~/api/mediaItems/mediaItemsApiQueryKeys"
import {
  createMediaRating,
  deleteMediaRating,
  getMediaRatingByMediaId,
  getMediaRatingByUserId,
  getMediaRatingsGetRecentlyCreated,
  updateMediaRating,
} from "~/api/mediaRatings/mediaRatingsApi"
import { MediaRatingsApiQueryKeys } from "~/api/mediaRatings/mediaRatingsApiQueryKeys"

export function useGetMediaRatingByMediaIdApi(args: GetMediaRatingByMediaIdArgs) {
  return useQuery({
    queryKey: [MediaRatingsApiQueryKeys.GET_BY_MEDA_ID, args.mediaId],
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
    queryKey: [MediaRatingsApiQueryKeys.GET_ALL_BY_USER_ID, args],
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
    queryKey: [MediaRatingsApiQueryKeys.GET_RECENTLY_CREATED, args],
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
    mutationKey: [MediaRatingsApiQueryKeys.CREATE],
    mutationFn: (body: Omit<CreateMediaRatingBody, "mediaDetailsId">) => {
      return createMediaRating(body)
    },
    onSuccess: async (data: MediaRatingType) => {
      await Promise.all([
        queryClient.setQueryData([MediaRatingsApiQueryKeys.GET_BY_MEDA_ID, data.mediaId], data),
        queryClient.refetchQueries({
          queryKey: [MediaItemsQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}

export function useUpdateMediaRatingApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaRatingsApiQueryKeys.UPDATE],
    mutationFn: (args: UpdateMediaRatingArgs) => {
      return updateMediaRating(args)
    },
    onSuccess: async (data: MediaRatingType) => {
      await Promise.all([
        queryClient.setQueryData([MediaRatingsApiQueryKeys.GET_BY_MEDA_ID, data.mediaId], data),
        queryClient.refetchQueries({
          queryKey: [MediaItemsQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}

export function useDeleteMediaRatingApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaRatingsApiQueryKeys.DELETE],
    mutationFn: (args: DeleteMediaRatingArgs) => deleteMediaRating(args),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.resetQueries({
          queryKey: [MediaRatingsApiQueryKeys.GET_BY_MEDA_ID, data.mediaId],
        }),
        queryClient.refetchQueries({
          queryKey: [MediaItemsQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}
