import type { MediaTypeEnum } from "./mediaItem"

export interface MediaDetailsType {
  id: string
  mediaId: number
  mediaType: MediaTypeEnum
  score: number
  en: MediaDetailsInfoType
  ru: MediaDetailsInfoType
  createdAt: Date
  updatedAt: Date
}

export interface MediaDetailsInfoType {
  title: string
  originalTitle: string
  poster: string
  seasons?: MediaDetailsInfoSeasonType[]
  status?: string
  releaseDate?: string
}

export interface MediaDetailsInfoSeasonType {
  name: string
  airDate: string
  episodeCount: number
  episodes: MediaDetailsInfoSeasonEpisodeType[]
  seasonNumber: number
}

export interface MediaDetailsInfoSeasonEpisodeType {
  airDate: string
  episodeNumber: number
  seasonNumber: number
  poster?: string
  name: string
}
