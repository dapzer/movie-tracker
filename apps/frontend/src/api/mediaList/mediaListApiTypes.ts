import { MediaItemStatusNameEnum } from "@movie-tracker/types";

export interface MediaListUpdateApiTypes {
  title?: string,
  isPublic?: boolean,
  poster?: string
}

export interface MediaListCreateCloneApiTypes {
  selectedStatuses: MediaItemStatusNameEnum[]
  title: string
  isKeepStatus: boolean
}
