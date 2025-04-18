import type { MediaItemStatusNameEnum, MediaListUpdateBodyType } from "@movie-tracker/types"

export type MediaListUpdateApiTypes = MediaListUpdateBodyType

export interface MediaListCreateCloneApiTypes {
  selectedStatuses: MediaItemStatusNameEnum[]
  title: string
  isKeepStatus: boolean
}
