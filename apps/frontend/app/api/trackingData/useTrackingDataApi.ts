import type { UseQueryOptions } from "@tanstack/vue-query"
import type { GetTrackingDataByMediaItemIdApiArgs } from "~/api/trackingData/trackingDataApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { MediaItemsQueryKeys } from "~/api/mediaItems/mediaItemsApiQueryKeys"
import {
  bulkUpdateTrackingDataApi,
  getTrackingDataByMediaItemIdApi,
  updateTrackingDataApi,
} from "~/api/trackingData/trackingDataApi"
import { TrackingDataQueryKeys } from "~/api/trackingData/trackingDataApiQueryKeys"

export function useGetTrackingDataByMediaItemIdApi(args: GetTrackingDataByMediaItemIdApiArgs, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [TrackingDataQueryKeys.GET_BY_MEDIA_ITEM_ID, args.mediaItemId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getTrackingDataByMediaItemIdApi(args, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useUpdateTrackingDataApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [TrackingDataQueryKeys.UPDATE],
    mutationFn: updateTrackingDataApi,
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.setQueryData([TrackingDataQueryKeys.GET_BY_MEDIA_ITEM_ID, data.mediaItemId], data),
        queryClient.refetchQueries({
          queryKey: [MediaItemsQueryKeys.GET_COUNT_BY_MEDIA_LIST_ID],
        }),
        queryClient.refetchQueries({
          queryKey: [MediaItemsQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}

export function useBulkUpdateTrackingDataApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [TrackingDataQueryKeys.BULK_UPDATE],
    mutationFn: bulkUpdateTrackingDataApi,
    onSuccess: async (data) => {
      await Promise.all([
        ...data.map(item =>
          queryClient.setQueryData([TrackingDataQueryKeys.GET_BY_MEDIA_ITEM_ID, item.mediaItemId], item),
        ),
        queryClient.refetchQueries({
          queryKey: [MediaItemsQueryKeys.GET_COUNT_BY_MEDIA_LIST_ID],
        }),
        queryClient.refetchQueries({
          queryKey: [MediaItemsQueryKeys.GET_BY_MEDIA_LIST_ID],
        }),
      ])
    },
  })
}
