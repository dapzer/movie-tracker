import type { ReleaseSubscriptionType } from "@movie-tracker/types"
import type { UseQueryOptions } from "@tanstack/vue-query"
import type { Ref } from "vue"
import type {
  GetReleaseSubscriptionByMediaIdArgs,
  GetReleaseSubscriptionsByUserIdArgs,
} from "~/api/releaseSubscriptions/releaseSubscriptionsApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  createReleaseSubscription,
  deleteReleaseSubscription,
  getReleaseSubscriptionByMediaId,
  getReleaseSubscriptionsByUserId,
} from "~/api/releaseSubscriptions/releaseSubscriptionsApi"
import { ReleaseSubscriptionsApiQueryKeys } from "~/api/releaseSubscriptions/releaseSubscriptionsApiQueryKeys"

export function useGetReleaseSubscriptionByMediaIdApi(args: GetReleaseSubscriptionByMediaIdArgs) {
  return useQuery({
    queryKey: [ReleaseSubscriptionsApiQueryKeys.GET_BY_MEDIA_ID, args.mediaId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getReleaseSubscriptionByMediaId(args, { headers })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useGetReleaseSubscriptionsByUserIdApi(args: Ref<GetReleaseSubscriptionsByUserIdArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [ReleaseSubscriptionsApiQueryKeys.GET_ALL_BY_USER_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getReleaseSubscriptionsByUserId(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useCreateReleaseSubscriptionApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [ReleaseSubscriptionsApiQueryKeys.CREATE],
    mutationFn: createReleaseSubscription,
    onSuccess: async (data: ReleaseSubscriptionType) => {
      await Promise.all([
        queryClient.setQueryData([ReleaseSubscriptionsApiQueryKeys.GET_BY_MEDIA_ID, data.mediaId], data),
        queryClient.refetchQueries({
          queryKey: [ReleaseSubscriptionsApiQueryKeys.GET_ALL_BY_USER_ID],
        }),
      ])
    },
  })
}

export function useDeleteReleaseSubscriptionApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [ReleaseSubscriptionsApiQueryKeys.DELETE],
    mutationFn: deleteReleaseSubscription,
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.setQueryData([ReleaseSubscriptionsApiQueryKeys.GET_BY_MEDIA_ID, data.mediaId], null),
        queryClient.refetchQueries({
          queryKey: [ReleaseSubscriptionsApiQueryKeys.GET_ALL_BY_USER_ID],
        }),
      ])
    },
  })
}
