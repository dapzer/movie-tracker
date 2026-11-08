import { MediaTypeEnum } from "@movie-tracker/types"
import { z } from "zod"

export const recommendationItemSchema = z.object({
  mediaType: z.enum([MediaTypeEnum.MOVIE, MediaTypeEnum.TV]).meta({ example: MediaTypeEnum.MOVIE }),
  title: z.string().trim().min(1).max(300).meta({ example: "Oldboy" }),
  releaseYear: z.number().int().min(1874).max(2200).meta({ example: 2003 }),
  reason: z.string().trim().min(1).max(1000).meta({
    example: "Recommended for its intense atmosphere and unconventional revenge story.",
  }),
})

export const recommendationTasteSummarySchema = z.object({
  summary: z.string().trim().min(1).max(4000),
})

export const recommendationResponseSchema = z.object({
  sessionId: z.uuid().meta({ format: "uuid" }),
  recommendations: z.array(recommendationItemSchema),
})

export function createRecommendationBatchSchema(minimumCount: number, maximumCount = minimumCount) {
  return z.object({
    recommendations: z.array(recommendationItemSchema).min(minimumCount).max(maximumCount),
  })
}
