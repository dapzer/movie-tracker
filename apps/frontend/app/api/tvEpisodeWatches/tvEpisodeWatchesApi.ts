import type { TvEpisodeWatchType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  BulkCreateTvEpisodeWatchBody,
  CreateTvEpisodeWatchBody,
  DeleteTvEpisodeWatchArgs,
  GetTvEpisodeWatchesByWatchCycleIdArgs,
} from "~/api/tvEpisodeWatches/tvEpisodeWatchesApiTypes"
import { api } from "~/api/instance"

export function getTvEpisodeWatchesByWatchCycleId(args: GetTvEpisodeWatchesByWatchCycleIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<TvEpisodeWatchType[]>(`tv-episode-watches/by-watch-cycle-id/${args.watchCycleId}`, options)
}

export function createTvEpisodeWatch(body: CreateTvEpisodeWatchBody) {
  return api.post<TvEpisodeWatchType>("tv-episode-watches", body)
}

export function bulkCreateTvEpisodeWatch(body: BulkCreateTvEpisodeWatchBody) {
  return api.post<TvEpisodeWatchType[]>("tv-episode-watches/bulk", body)
}

export function deleteTvEpisodeWatch(args: DeleteTvEpisodeWatchArgs) {
  return api.delete<TvEpisodeWatchType>(`tv-episode-watches/${args.id}`)
}
