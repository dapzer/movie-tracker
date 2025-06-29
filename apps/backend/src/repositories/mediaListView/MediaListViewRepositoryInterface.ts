import { MediaListViewType } from "@movie-tracker/types"

export const MediaListViewRepositorySymbol = Symbol("mediaListViewRepository")

export interface MediaListViewRepositoryInterface {
  createMediaListView: (
    args: {
      mediaListId: string
      userId: string
    }
  ) => Promise<void>

  updateMediaListView: (args: {
    id: string
  }) => Promise<void>

  getMediaListView: (args: {
    mediaListId: string
    userId: string
  }) => Promise<MediaListViewType>
}
