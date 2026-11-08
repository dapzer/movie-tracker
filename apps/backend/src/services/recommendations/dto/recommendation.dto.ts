import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"
import { recommendationItemSchema, recommendationResponseSchema } from "@/services/recommendationGenerator/recommendation.schemas"

const recommendationItemWithDetailsSchema = recommendationItemSchema.extend({
  mediaDetails: MediaDetailsDto.schema.optional(),
})

const recommendationResponseWithDetailsSchema = recommendationResponseSchema.extend({
  recommendations: z.array(recommendationItemWithDetailsSchema),
})

export class RecommendationItemDto extends createZodDto(recommendationItemWithDetailsSchema) {}

export class RecommendationResponseDto extends createZodDto(recommendationResponseWithDetailsSchema) {}

export class RecommendationSessionParamsDto extends createZodDto(z.object({
  sessionId: z.uuid().meta({ format: "uuid" }),
})) {}
