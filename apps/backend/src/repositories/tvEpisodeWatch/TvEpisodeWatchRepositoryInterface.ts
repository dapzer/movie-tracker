import { TvEpisodeWatchType } from "@movie-tracker/types"

export const TvEpisodeWatchRepositorySymbol = Symbol("TvEpisodeWatchRepository")

export interface TvEpisodeWatchRepositoryInterface {
  getById: (id: string) => Promise<TvEpisodeWatchType | undefined>

  getByCycleId: (watchCycleId: string) => Promise<TvEpisodeWatchType[]>

  getByCycleIds: (watchCycleIds: string[]) => Promise<TvEpisodeWatchType[]>

  create: (args: {
    watchCycleId: string
    userId: string
    mediaId: number
    mediaDetailsId?: string | null
    seasonNumber: number
    episodeNumber: number
  }) => Promise<TvEpisodeWatchType>

  createMany: (args: Array<{
    watchCycleId: string
    userId: string
    mediaId: number
    mediaDetailsId?: string | null
    seasonNumber: number
    episodeNumber: number
    watchedAt?: Date
  }>) => Promise<TvEpisodeWatchType[]>

  delete: (id: string) => Promise<TvEpisodeWatchType | undefined>
}
