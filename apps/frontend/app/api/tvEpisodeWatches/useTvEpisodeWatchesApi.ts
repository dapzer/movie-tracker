import type { TvEpisodeWatchType } from "@movie-tracker/types"
import type {
  BulkCreateTvEpisodeWatchBody,
  GetTvEpisodeWatchesByWatchCycleIdArgs,
} from "~/api/tvEpisodeWatches/tvEpisodeWatchesApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  bulkCreateTvEpisodeWatch,
  createTvEpisodeWatch,
  deleteTvEpisodeWatch,
  getTvEpisodeWatchesByWatchCycleId,
} from "~/api/tvEpisodeWatches/tvEpisodeWatchesApi"
import { TvEpisodeWatchesApiQueryKeys } from "~/api/tvEpisodeWatches/tvEpisodeWatchesApiQueryKeys"
import { TvWatchCyclesApiQueryKeys } from "~/api/tvWatchCycles/tvWatchCyclesApiQueryKeys"

export function useGetTvEpisodeWatchesByWatchCycleIdApi(args: GetTvEpisodeWatchesByWatchCycleIdArgs) {
  return useQuery({
    queryKey: [TvEpisodeWatchesApiQueryKeys.GET_BY_WATCH_CYCLE_ID, args.watchCycleId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getTvEpisodeWatchesByWatchCycleId(args, { headers })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useCreateTvEpisodeWatchApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [TvEpisodeWatchesApiQueryKeys.CREATE],
    mutationFn: createTvEpisodeWatch,
    onSuccess: async (data: TvEpisodeWatchType) => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [TvEpisodeWatchesApiQueryKeys.GET_BY_WATCH_CYCLE_ID, data.watchCycleId],
        }),
        queryClient.refetchQueries({
          queryKey: [TvWatchCyclesApiQueryKeys.GET_ACTIVE_BY_MEDIA_ITEM_ID],
        }),
      ])
    },
  })
}

export function useBulkCreateTvEpisodeWatchApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [TvEpisodeWatchesApiQueryKeys.BULK_CREATE],
    mutationFn: bulkCreateTvEpisodeWatch,
    onSuccess: async (_data: TvEpisodeWatchType[], variables: BulkCreateTvEpisodeWatchBody) => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [TvEpisodeWatchesApiQueryKeys.GET_BY_WATCH_CYCLE_ID, variables.watchCycleId],
        }),
        queryClient.refetchQueries({
          queryKey: [TvWatchCyclesApiQueryKeys.GET_ACTIVE_BY_MEDIA_ITEM_ID],
        }),
      ])
    },
  })
}

export function useDeleteTvEpisodeWatchApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [TvEpisodeWatchesApiQueryKeys.DELETE],
    mutationFn: deleteTvEpisodeWatch,
    onSuccess: async (data: TvEpisodeWatchType) => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [TvEpisodeWatchesApiQueryKeys.GET_BY_WATCH_CYCLE_ID, data.watchCycleId],
        }),
        queryClient.refetchQueries({
          queryKey: [TvWatchCyclesApiQueryKeys.GET_ACTIVE_BY_MEDIA_ITEM_ID],
        }),
      ])
    },
  })
}
