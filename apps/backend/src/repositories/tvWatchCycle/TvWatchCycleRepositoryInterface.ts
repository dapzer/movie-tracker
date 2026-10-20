import { TvWatchCycleType } from "@movie-tracker/types"

export const TvWatchCycleRepositorySymbol = Symbol("TvWatchCycleRepository")

export interface TvWatchCycleRepositoryInterface {
  getById: (id: string) => Promise<TvWatchCycleType | undefined>

  getActiveByMediaItemId: (mediaItemId: string) => Promise<TvWatchCycleType | undefined>

  getAllByMediaItemId: (mediaItemId: string) => Promise<TvWatchCycleType[]>

  create: (args: {
    mediaItemId: string
    userId: string
    mediaId: number
    cycleNumber: number
    startedAt?: Date
  }) => Promise<TvWatchCycleType>

  createMany: (args: Array<{
    mediaItemId: string
    userId: string
    mediaId: number
    cycleNumber: number
    startedAt?: Date
    finishedAt?: Date | null
  }>) => Promise<TvWatchCycleType[]>

  startNewCycle: (args: {
    mediaItemId: string
    userId: string
    mediaId: number
  }) => Promise<TvWatchCycleType>
}
