import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import {
  RECOMMENDATION_COUNT_DEFAULT,
  RECOMMENDATION_COUNT_MAX,
} from "@/services/recommendations/dto/generateRecommendations.dto"

const generateMediaListRecommendationsSchema = z.object({
  count: z.number().int().min(1).max(RECOMMENDATION_COUNT_MAX).optional().default(RECOMMENDATION_COUNT_DEFAULT).meta({
    minimum: 1,
    maximum: RECOMMENDATION_COUNT_MAX,
    example: RECOMMENDATION_COUNT_DEFAULT,
  }),
  sessionId: z.uuid().optional().meta({ format: "uuid" }),
})

export class GenerateMediaListRecommendationsDto extends createZodDto(generateMediaListRecommendationsSchema) {}
