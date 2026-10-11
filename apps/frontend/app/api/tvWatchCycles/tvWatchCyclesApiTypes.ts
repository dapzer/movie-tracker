export interface GetTvWatchCyclesByMediaItemIdArgs {
  mediaItemId: string
}

export type GetActiveTvWatchCycleByMediaItemIdArgs = GetTvWatchCyclesByMediaItemIdArgs

export interface StartTvWatchCycleBody {
  mediaItemId: string
}
