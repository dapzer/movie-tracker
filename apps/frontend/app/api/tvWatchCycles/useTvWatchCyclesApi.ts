import type { TvWatchCycleType } from "@movie-tracker/types"
import type {
  GetActiveTvWatchCycleByMediaItemIdArgs,
  GetTvWatchCyclesByMediaItemIdArgs,
} from "~/api/tvWatchCycles/tvWatchCyclesApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  getActiveTvWatchCycleByMediaItemId,
  getTvWatchCyclesByMediaItemId,
  startTvWatchCycle,
} from "~/api/tvWatchCycles/tvWatchCyclesApi"
import { TvWatchCyclesApiQueryKeys } from "~/api/tvWatchCycles/tvWatchCyclesApiQueryKeys"

export function useGetTvWatchCyclesByMediaItemIdApi(args: GetTvWatchCyclesByMediaItemIdArgs) {
  return useQuery({
    queryKey: [TvWatchCyclesApiQueryKeys.GET_BY_MEDIA_ITEM_ID, args.mediaItemId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getTvWatchCyclesByMediaItemId(args, { headers })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useGetActiveTvWatchCycleByMediaItemIdApi(args: GetActiveTvWatchCycleByMediaItemIdArgs) {
  return useQuery({
    queryKey: [TvWatchCyclesApiQueryKeys.GET_ACTIVE_BY_MEDIA_ITEM_ID, args.mediaItemId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getActiveTvWatchCycleByMediaItemId(args, { headers })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useStartTvWatchCycleApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [TvWatchCyclesApiQueryKeys.CREATE],
    mutationFn: startTvWatchCycle,
    onSuccess: async (data: TvWatchCycleType) => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [TvWatchCyclesApiQueryKeys.GET_BY_MEDIA_ITEM_ID, data.mediaItemId],
        }),
        queryClient.refetchQueries({
          queryKey: [TvWatchCyclesApiQueryKeys.GET_ACTIVE_BY_MEDIA_ITEM_ID, data.mediaItemId],
        }),
      ])
    },
  })
}
