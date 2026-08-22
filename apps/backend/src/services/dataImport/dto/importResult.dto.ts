import { z } from "zod"

export interface MediaIds {
  tmdbId: number
  traktId?: number
  imdbId?: string
}

export interface EpisodeProgress {
  status: "watched" | "watching_now"
  seasonNumber: number
  episodeNumber: number
}

export interface Media {
  type: "movie" | "tv"
  title: string
  ids: MediaIds
  createdAt?: Date
  note?: string
  episodesProgress?: EpisodeProgress[]
}

export interface List {
  title: string
  isPrivate: boolean
  items: ImportBucket<Media>
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Review {
  media: Media
  content: string
  createdAt: Date
  updatedAt?: Date
  rate?: number
}

export interface Rating {
  media: Media
  value: number
  createdAt: Date
}

export interface Failure {
  reason: string
  sourceRecord: unknown
}

export interface ImportBucket<T> {
  success: T[]
  failed: Failure[]
}

export interface ImportRawResult {
  watched: ImportBucket<Media>
  watchList: ImportBucket<Media>
  ratings: ImportBucket<Rating>
  reviews: ImportBucket<Review>
  lists: ImportBucket<List>
  // TODO: Think about to remove it
  notes: ImportBucket<Media>
}

const positiveIntegerSchema = z.number().int().positive()

export const mediaIdsSchema = z.object({
  tmdbId: positiveIntegerSchema,
  traktId: positiveIntegerSchema.optional(),
  imdbId: z.string().min(1).optional(),
})

export const episodeProgressSchema = z.object({
  status: z.enum(["watched", "watching_now"]),
  seasonNumber: z.number().int().nonnegative(),
  episodeNumber: positiveIntegerSchema,
})

export const mediaSchema = z.object({
  type: z.enum(["movie", "tv"]),
  title: z.string().min(1),
  ids: mediaIdsSchema,
  createdAt: z.date().optional(),
  note: z.string().optional(),
  episodesProgress: z.array(episodeProgressSchema).optional(),
})

export const ratingSchema = z.object({
  media: mediaSchema,
  value: z.number().min(0).max(10),
  createdAt: z.date(),
})

export const reviewSchema = z.object({
  media: mediaSchema,
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  rate: z.number().min(0).max(10).optional(),
})
