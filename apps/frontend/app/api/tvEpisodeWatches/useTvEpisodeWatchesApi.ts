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
      await queryClient.refetchQueries({
        queryKey: [TvEpisodeWatchesApiQueryKeys.GET_BY_WATCH_CYCLE_ID, data.watchCycleId],
      })
    },
  })
}

export function useBulkCreateTvEpisodeWatchApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [TvEpisodeWatchesApiQueryKeys.BULK_CREATE],
    mutationFn: bulkCreateTvEpisodeWatch,
    onSuccess: async (_data: TvEpisodeWatchType[], variables: BulkCreateTvEpisodeWatchBody) => {
      await queryClient.refetchQueries({
        queryKey: [TvEpisodeWatchesApiQueryKeys.GET_BY_WATCH_CYCLE_ID, variables.watchCycleId],
      })
    },
  })
}

export function useDeleteTvEpisodeWatchApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [TvEpisodeWatchesApiQueryKeys.DELETE],
    mutationFn: deleteTvEpisodeWatch,
    onSuccess: async (data: TvEpisodeWatchType) => {
      await queryClient.refetchQueries({
        queryKey: [TvEpisodeWatchesApiQueryKeys.GET_BY_WATCH_CYCLE_ID, data.watchCycleId],
      })
    },
  })
}
