import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const updateMediaRatingSchema = z.object({
  rating: z.number().min(0).max(10).meta({ minimum: 0, maximum: 10, example: 9 }),
})

export class UpdateMediaRatingDto extends createZodDto(updateMediaRatingSchema) {}
