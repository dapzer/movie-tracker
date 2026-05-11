import type { MediaTypeEnum } from "./mediaItem"

export interface MediaDetailsType {
  id: string
  mediaId: number
  mediaType: MediaTypeEnum
  score: number
  releaseDate?: string
  en: MediaDetailsInfoType
  ru: MediaDetailsInfoType
  genres: MediaDetailsGenres
  status?: string
  createdAt: Date
  updatedAt: Date
}

export type MediaDetailsGenres = Array<number>

export type MediaDetailsCreateBodyType = Pick<MediaDetailsType, "mediaId" | "mediaType" | "genres" | "score" | "status" | "releaseDate" | "en" | "ru">
export type MediaDetailsUpdateBodyType = Pick<MediaDetailsType, "genres" | "score" | "status" | "releaseDate" | "en" | "ru">

export interface MediaDetailsInfoType {
  title: string
  originalTitle: string
  poster: string
  seasons?: MediaDetailsInfoSeasonType[]
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

export interface MediaDetailsUpdateProgressType {
  successfulUpdates: number
  failedUpdatesByApi: number
  failedUpdatesByDb: number
}
