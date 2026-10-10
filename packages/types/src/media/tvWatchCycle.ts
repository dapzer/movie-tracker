import type { TvEpisodeWatchType } from "./tvEpisodeWatch"

export interface TvWatchCycleType {
  id: string
  mediaItemId: string
  userId: string
  mediaId: number
  cycleNumber: number
  startedAt: Date
  finishedAt: Date | null
}

export interface TvWatchCycleWithEpisodesType extends TvWatchCycleType {
  episodeWatches: TvEpisodeWatchType[]
}
