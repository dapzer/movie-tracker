import type { TvWatchCycleType, TvWatchCycleWithEpisodesType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  GetActiveTvWatchCycleByMediaItemIdArgs,
  GetTvWatchCyclesByMediaItemIdArgs,
  StartTvWatchCycleBody,
} from "~/api/tvWatchCycles/tvWatchCyclesApiTypes"
import { api } from "~/api/instance"

export function getTvWatchCyclesByMediaItemId(args: GetTvWatchCyclesByMediaItemIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<TvWatchCycleType[]>(`tv-watch-cycles/by-media-item-id/${args.mediaItemId}`, options)
}

export function getActiveTvWatchCycleByMediaItemId(args: GetActiveTvWatchCycleByMediaItemIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<TvWatchCycleWithEpisodesType | null>(`tv-watch-cycles/by-media-item-id/${args.mediaItemId}/active`, options)
}

export function startTvWatchCycle(body: StartTvWatchCycleBody) {
  return api.post<TvWatchCycleType>("tv-watch-cycles", body)
}
