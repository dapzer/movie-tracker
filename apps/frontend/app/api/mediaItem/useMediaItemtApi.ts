import type { MediaItemTrackingDataType, MediaItemType, MediaListType } from "@movie-tracker/types"
import type { UseQueryOptions } from "@tanstack/vue-query"
import type {
  GetMediaItemsByMediaIdApiArgs,
  MediaItemBulkCreateApiTypes,
  MediaItemBulkDeleteApiTypes,
  MediaItemBulkUpdateTrackingDataApiTypes,
  MediaItemCreateApiTypes,
  MediaItemUpdateApiTypes,
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

export function useGetMediaItemsByMediaIdApi(args: GetMediaItemsByMediaIdApiArgs) {
  return useQuery({
    queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_ID, args.mediaId],
    queryFn: () => {
      return getMediaItemsByMediaIdApi(args)
    },
    retry: false,
    retryOnMount: true,
  })
}

export function useGetMediaItemsByMediaListIdApi(mediaListId: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID, mediaListId],
    queryFn: () => getMediaItemsByMediaListIdApi(mediaListId),
    ...options,
  })
}

export function useCreateMediaItemApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.CREATE],
    mutationFn: (args: MediaItemCreateApiTypes) => createMediaItemApi(args),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => [...oldData, data])
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

export function useDeleteMediaItemApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.DELETE],
    mutationFn: (id: string) => deleteMediaItemApi(id),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        return oldData.filter(item => item.id !== data.id)
      })
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => {
        const mediaList = oldData.find(el => el.id === data.mediaListId)
        if (!mediaList)
          return mediaList
        mediaList.mediaItemsCount = (mediaList.mediaItemsCount || 1) - 1
        return oldData
      })
    },
  })
}

export function useUpdateMediaItemTrackingDataApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.UPDATE_TRACKING_DATA],
    mutationFn: (args: {
      trackingDataId: string
      body: MediaItemTrackingDataType
    }) => updateMediaItemTrackingDataApi(args.trackingDataId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        return oldData.map(item => item.id !== data.mediaItemId
          ? item
          : {
              ...item,
              trackingData: data,
            })
      })
    },
  })
}

export function useCreateMediaItemCloneApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.CREATE_CLONE],
    mutationFn: createMediaItemCloneApi,
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => [...oldData, data])
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
    mutationFn: (args: {
      mediaItemId: string
      body: MediaItemUpdateApiTypes
    }) => updateMediaItemApi(args.mediaItemId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        return oldData.map(item => item.id !== data.id ? item : data)
      })
    },
  })
}

export function useBulkCreateMediaItemsApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.BULK_CREATE],
    mutationFn: (args: MediaItemBulkCreateApiTypes) => bulkCreateMediaItemsApi(args),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => [...oldData, ...data])
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
    mutationFn: (args: MediaItemBulkDeleteApiTypes) => bulkDeleteMediaItemsApi(args),
    onSuccess: async (data) => {
      const deletedIds = new Set(data.map(item => item.id))
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        return oldData.filter(item => !deletedIds.has(item.id))
      })
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MediaItemQueryKeys.BULK_UPDATE_TRACKING_DATA],
    mutationFn: (args: MediaItemBulkUpdateTrackingDataApiTypes) => bulkUpdateMediaItemTrackingDataApi(args),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        const updatedByItemId = new Map(data.map(item => [item.mediaItemId, item]))
        return oldData.map(item => updatedByItemId.get(item.id)
          ? {
              ...item,
              trackingData: updatedByItemId.get(item.id),
            }
          : item)
      })
    },
  })
}
