import { z } from "zod"

const letterboxdDateSchema = z.string().pipe(z.coerce.date())
const letterboxdOptionalDateSchema = z.preprocess(
  value => value === "" ? undefined : value,
  z.string().pipe(z.coerce.date()).optional(),
)
const letterboxdYearSchema = z.coerce.number().int().positive()
const letterboxdOptionalRatingSchema = z.preprocess(
  value => value === "" ? undefined : value,
  z.coerce.number().min(0).max(5).optional(),
)

const letterboxdFilmBaseSchema = z.looseObject({
  "Date": letterboxdDateSchema,
  "Name": z.string().min(1),
  "Year": letterboxdYearSchema,
  "Letterboxd URI": z.url(),
})

export const letterboxdWatchedSchema = letterboxdFilmBaseSchema

export const letterboxdDiarySchema = letterboxdFilmBaseSchema.extend({
  "Rating": letterboxdOptionalRatingSchema,
  "Rewatch": z.string(),
  "Tags": z.string(),
  "Watched Date": letterboxdOptionalDateSchema,
})

export const letterboxdRatingSchema = letterboxdFilmBaseSchema.extend({
  Rating: z.coerce.number().min(0).max(5),
})

export const letterboxdReviewSchema = letterboxdFilmBaseSchema.extend({
  "Rating": letterboxdOptionalRatingSchema,
  "Rewatch": z.string(),
  "Review": z.string(),
  "Tags": z.string(),
  "Watched Date": letterboxdOptionalDateSchema,
})

export const letterboxdWatchlistSchema = letterboxdFilmBaseSchema

export const letterboxdListMetadataSchema = z.looseObject({
  Date: letterboxdDateSchema,
  Name: z.string().min(1),
  Tags: z.string(),
  URL: z.url(),
  Description: z.string(),
})

export const letterboxdListItemSchema = z.looseObject({
  Position: z.coerce.number().int().positive(),
  Name: z.string().min(1),
  Year: letterboxdYearSchema,
  URL: z.url(),
  Description: z.string(),
})
