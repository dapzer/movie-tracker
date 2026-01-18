import type { ReleaseSubscriptionType } from "@movie-tracker/types"
import type { UseQueryOptions } from "@tanstack/vue-query"
import type {
  GetReleaseSubscriptionByMediaIdArgs,
  GetReleaseSubscriptionsByUserIdArgs,
} from "~/api/releaseSubscription/releaseSubscriptionApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  createReleaseSubscription,
  deleteReleaseSubscription,
  getReleaseSubscriptionByMediaId,
  getReleaseSubscriptionsByUserId,
} from "~/api/releaseSubscription/releaseSubscriptionApi"
import { ReleaseSubscriptionApiQueryKeys } from "~/api/releaseSubscription/releaseSubscriptionApiQueryKeys"

export function useGetReleaseSubscriptionByMediaIdApi(args: GetReleaseSubscriptionByMediaIdArgs) {
  return useQuery({
    queryKey: [ReleaseSubscriptionApiQueryKeys.GET_BY_MEDIA_ID, args.mediaId],
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

export function useGetReleaseSubscriptionsByUserIdApi(args: GetReleaseSubscriptionsByUserIdArgs, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [ReleaseSubscriptionApiQueryKeys.GET_ALL_BY_USER_ID, args.limit, args.offset],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getReleaseSubscriptionsByUserId(args, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useCreateReleaseSubscriptionApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [ReleaseSubscriptionApiQueryKeys.CREATE],
    mutationFn: createReleaseSubscription,
    onSuccess: async (data: ReleaseSubscriptionType) => {
      await queryClient.setQueryData([ReleaseSubscriptionApiQueryKeys.GET_BY_MEDIA_ID, data.mediaId], data)
    },
  })
}

export function useDeleteReleaseSubscriptionApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [ReleaseSubscriptionApiQueryKeys.DELETE],
    mutationFn: deleteReleaseSubscription,
    onSuccess: async (data) => {
      await queryClient.setQueryData([ReleaseSubscriptionApiQueryKeys.GET_BY_MEDIA_ID, data.mediaId], null)
    },
  })
}
