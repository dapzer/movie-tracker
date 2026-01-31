import { MediaListViewType } from "@movie-tracker/types"

export const MediaListViewRepositorySymbol = Symbol("mediaListViewRepository")

export interface MediaListViewRepositoryInterface {
  create: (args: {
    mediaListId: string
    userId: string
  }) => Promise<void>

  update: (args: {
    id: string
  }) => Promise<void>

  getByUseerAndMediaListId: (args: {
    mediaListId: string
    userId: string
  }) => Promise<MediaListViewType>
}
