import type { MediaListType } from "@movie-tracker/types"
import type { UseQueryOptions } from "@tanstack/vue-query"
import type { MediaListCreateCloneApiTypes, MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"
import {
  createLikeMediaListApi,
  createMediaListsApi,
  createMediaListsCloneApi,
  deleteLikeMediaListApi,
  deleteMediaListsApi,
  getMediaListsApi,
  getMediaListsByIdApi,
  updateMediaListsApi,
} from "~/api/mediaList/mediaListApi"
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys"

export function useGetMediaListsApi(options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaListQueryKeys.GET_ALL],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getMediaListsApi(undefined, { headers })
    },
    retry: false,
    ...options,
  })
}

export function useGetMediaListsByUserIdApi(userId: string) {
  return useQuery({
    queryKey: [MediaListQueryKeys.GET_BY_USER_ID, userId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaListsApi({ userId }, { headers })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useGetMediaListByIdApi(mediaListId: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaListQueryKeys.GET_BY_ID, mediaListId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaListsByIdApi(mediaListId, { headers })
    },
    ...options,
  })
}

export function useCreateMediaListApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaListQueryKeys.CREATE],
    mutationFn: async (body: MediaListUpdateApiTypes) => await createMediaListsApi(body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => [...oldData, data])
    },
  })
}

export function useCreateMediaListCloneApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaListQueryKeys.CREATE],
    mutationFn: async (args: {
      mediaListId: string
      body: MediaListCreateCloneApiTypes
    }) => await createMediaListsCloneApi(args.mediaListId, args.body),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => [...oldData, data]),
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_ALL],
        }),
      ])
    },
  })
}

export function useDeleteMediaListApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaListQueryKeys.DELETE],
    mutationFn: async (id: string) => await deleteMediaListsApi(id),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.resetQueries({
          queryKey: [MediaListQueryKeys.GET_BY_ID, data.id],
        }),
        queryClient.resetQueries({
          queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID, data.id],
          exact: false,
        }),
      ])
    },
  })
}

export function useUpdateMediaListApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaListQueryKeys.UPDATE],
    mutationFn: async (args: {
      mediaListId: string
      body: MediaListUpdateApiTypes
    }) => await updateMediaListsApi(args.mediaListId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_BY_ID, data.humanFriendlyId], data)
    },
  })
}

export function useCreateLikeMediaListApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaListQueryKeys.CREATE_LIKE],
    mutationFn: async (mediaListId: string) => await createLikeMediaListApi(mediaListId),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_BY_ID, data.mediaListHumanFriendlyId], (oldData: MediaListType) => ({
        ...oldData,
        likesCount: (oldData.likesCount || 0) + 1,
        isLiked: true,
      }))
    },
  })
}

export function useDeleteLikeMediaListApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaListQueryKeys.CREATE_LIKE],
    mutationFn: async (mediaListId: string) => await deleteLikeMediaListApi(mediaListId),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_BY_ID, data.mediaListHumanFriendlyId], (oldData: MediaListType) => ({
        ...oldData,
        likesCount: (oldData.likesCount || 0) - 1,
        isLiked: false,
      }))
    },
  })
}
