import {
  MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH,
  MEDIA_REVIEW_CONTENT_MAX_LENGTH,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const RECOMMENDATION_COUNT_DEFAULT = 10
export const RECOMMENDATION_COUNT_MAX = 20
export const RECOMMENDATION_INPUT_ITEMS_MAX = 100

const recommendationInputItemSchema = z.object({
  title: z.string().trim().min(1).max(300).meta({ example: "Fight Club" }),
  originalTitle: z.string().trim().min(1).max(300).optional().meta({ example: "Fight Club" }),
  releaseYear: z.number().int().min(1874).max(2200).optional().meta({ example: 1999 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  rating: z.number().min(0).max(10).optional().meta({ minimum: 0, maximum: 10, example: 9 }),
  review: z.string().max(MEDIA_REVIEW_CONTENT_MAX_LENGTH).optional().meta({
    example: "Great atmosphere and memorable ending.",
  }),
  note: z.string().max(MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH).optional().meta({
    example: "Would like something similarly unconventional.",
  }),
})

const generateRecommendationsSchema = z.object({
  items: z.array(recommendationInputItemSchema).min(1).max(RECOMMENDATION_INPUT_ITEMS_MAX),
  count: z.number().int().min(1).max(RECOMMENDATION_COUNT_MAX).optional().default(RECOMMENDATION_COUNT_DEFAULT).meta({
    minimum: 1,
    maximum: RECOMMENDATION_COUNT_MAX,
    example: RECOMMENDATION_COUNT_DEFAULT,
  }),
})

export class GenerateRecommendationsDto extends createZodDto(generateRecommendationsSchema) {}
