export interface TvEpisodeWatchType {
  id: string
  watchCycleId: string
  userId: string
  mediaId: number
  mediaDetailsId: string | null
  seasonNumber: number
  episodeNumber: number
  rating: number | null
  watchedAt: Date
}
