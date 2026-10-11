export interface GetTvEpisodeWatchesByWatchCycleIdArgs {
  watchCycleId: string
}

export interface TvEpisodeRef {
  seasonNumber: number
  episodeNumber: number
}

export interface CreateTvEpisodeWatchBody extends TvEpisodeRef {
  watchCycleId: string
}

export interface BulkCreateTvEpisodeWatchBody {
  watchCycleId: string
  episodes: TvEpisodeRef[]
}

export interface DeleteTvEpisodeWatchArgs {
  id: string
}
