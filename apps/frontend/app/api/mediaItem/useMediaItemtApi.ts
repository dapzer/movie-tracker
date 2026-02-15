import type { MediaListType } from "@movie-tracker/types"
import type { UseQueryOptions } from "@tanstack/vue-query"
import type { Ref } from "vue"
import type {
  GetMediaItemsByMediaIdApiArgs,
  GetMediaItemsByMediaListIdApiArgs,
  GetMediaItemsCountByMediaListIdApiArgs,
} from "~/api/mediaItem/mediaItemApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  bulkCreateMediaItemsApi,
  bulkDeleteMediaItemsApi,
  bulkUpdateMediaItemTrackingDataApi,
  createMediaItemApi,
  createMediaItemCloneApi,
  deleteMediaItemApi,
  getMediaItemsApi,
  getMediaItemsByMediaIdApi,
  getMediaItemsByMediaListIdApi,
  getMediaItemsCountByMediaListIdApi,
  updateMediaItemApi,
  updateMediaItemTrackingDataApi,
} from "~/api/mediaItem/mediaItemApi"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys"

export function useGetMediaItemsApi() {
  return useQuery({
    queryKey: [MediaItemQueryKeys.GET_ALL],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getMediaItemsApi({
        headers,
      })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useGetMediaItemsByMediaIdApi(args: GetMediaItemsByMediaIdApiArgs, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_ID, args.mediaId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      return getMediaItemsByMediaIdApi(args, {
        headers,
      })
    },
    retry: false,
    retryOnMount: true,
    ...options,
  })
}

export function useGetMediaItemsByMediaListIdApi(args: Ref<GetMediaItemsByMediaListIdApiArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      return getMediaItemsByMediaListIdApi(args.value, {
        headers,
      })
    },
    ...options,
  })
}

export function useGetMediaItemsCountByMediaListIdApi(args: Ref<GetMediaItemsCountByMediaListIdApiArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaItemQueryKeys.GET_COUNT_BY_MEDIA_LIST_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      return getMediaItemsCountByMediaListIdApi(args.value, { headers })
    },
    ...options,
  })
}

export function useCreateMediaItemApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.CREATE],
    mutationFn: createMediaItemApi,
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[] | undefined) => {
        if (!oldData)
          return oldData
        const mediaList = oldData.find(el => el.id === data.mediaListId)
        if (!mediaList)
          return oldData
        mediaList.mediaItemsCount = (mediaList.mediaItemsCount || 0) + 1
        return oldData
      })
    },
  })
}

export function useDeleteMediaItemApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.DELETE],
    mutationFn: deleteMediaItemApi,
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_COUNT_BY_MEDIA_LIST_ID],
        }),
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}

export function useUpdateMediaItemTrackingDataApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.UPDATE_TRACKING_DATA],
    mutationFn: updateMediaItemTrackingDataApi,
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_COUNT_BY_MEDIA_LIST_ID],
        }),
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}

export function useCreateMediaItemCloneApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.CREATE_CLONE],
    mutationFn: createMediaItemCloneApi,
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => {
        const mediaList = oldData.find(el => el.id === data.mediaListId)
        if (!mediaList)
          return mediaList
        mediaList.mediaItemsCount = (mediaList.mediaItemsCount || 0) + 1
        return oldData
      })
    },
  })
}

export function useUpdateMediaItemApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.UPDATE],
    mutationFn: updateMediaItemApi,
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_COUNT_BY_MEDIA_LIST_ID],
        }),
        queryClient.refetchQueries({
          queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}

export function useBulkCreateMediaItemsApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.BULK_CREATE],
    mutationFn: bulkCreateMediaItemsApi,
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => {
        const mediaListCounts = new Map<string, number>()
        for (const item of data) {
          mediaListCounts.set(item.mediaListId, (mediaListCounts.get(item.mediaListId) || 0) + 1)
        }

        for (const list of oldData) {
          const diff = mediaListCounts.get(list.id)
          if (diff) {
            list.mediaItemsCount = (list.mediaItemsCount || 0) + diff
          }
        }
        return oldData
      })
    },
  })
}

export function useBulkDeleteMediaItemsApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.BULK_DELETE],
    mutationFn: bulkDeleteMediaItemsApi,
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => {
        const mediaListCounts = new Map<string, number>()
        for (const item of data) {
          mediaListCounts.set(item.mediaListId, (mediaListCounts.get(item.mediaListId) || 0) - 1)
        }

        for (const list of oldData) {
          const diff = mediaListCounts.get(list.id)
          if (diff) {
            list.mediaItemsCount = (list.mediaItemsCount || 0) + diff
          }
        }
        return oldData
      })
    },
  })
}

export function useBulkUpdateMediaItemTrackingDataApi() {
  return useMutation({
    mutationKey: [MediaItemQueryKeys.BULK_UPDATE_TRACKING_DATA],
    mutationFn: bulkUpdateMediaItemTrackingDataApi,
  })
}
