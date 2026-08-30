import { z } from "zod"

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
  releaseDate: z.date().optional(),
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
  isSpoiler: z.boolean().optional(),
})
