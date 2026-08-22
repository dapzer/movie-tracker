export enum DataImportSourceEnum {
  LETTERBOXD = "letterboxd",
  TRAKT = "trakt",
}

export enum DataImportStatusEnum {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface DataImportMediaIdsType {
  tmdbId: number
  traktId?: number
  imdbId?: string
}

export interface DataImportEpisodeProgressType {
  status: "watched" | "watching_now"
  seasonNumber: number
  episodeNumber: number
}

export interface DataImportMediaType {
  type: "movie" | "tv"
  title: string
  ids: DataImportMediaIdsType
  createdAt?: Date
  releaseDate?: Date
  note?: string
  episodesProgress?: DataImportEpisodeProgressType[]
}

export interface DataImportListType {
  title: string
  isPrivate: boolean
  items: DataImportBucketType<DataImportMediaType>
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface DataImportReviewType {
  media: DataImportMediaType
  content: string
  createdAt: Date
  updatedAt?: Date
  rate?: number
}

export interface DataImportRatingType {
  media: DataImportMediaType
  value: number
  createdAt: Date
}

export interface DataImportFailureType {
  reason: string
  sourceRecord: unknown
}

export interface DataImportBucketType<T> {
  success: T[]
  failed: DataImportFailureType[]
}

export interface DataImportRawResultType {
  watched: DataImportBucketType<DataImportMediaType>
  watchList: DataImportBucketType<DataImportMediaType>
  ratings: DataImportBucketType<DataImportRatingType>
  reviews: DataImportBucketType<DataImportReviewType>
  lists: DataImportBucketType<DataImportListType>
  // TODO: Think about to remove it
  notes: DataImportBucketType<DataImportMediaType>
}

export interface DataImportType {
  id: string
  userId: string
  source: DataImportSourceEnum
  status: DataImportStatusEnum
  result: DataImportRawResultType
  processedAt?: Date
  createdAt: Date
}

export type DataImportListItemType = Omit<DataImportType, "result">

export interface DataImportsPaginatedType {
  items: DataImportListItemType[]
  totalCount: number
}
