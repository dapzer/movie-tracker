import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const updateTvEpisodeWatchRatingSchema = z.object({
  rating: z.number().int().min(0).max(10).nullable().meta({ minimum: 0, maximum: 10, example: 8 }),
})

export class UpdateTvEpisodeWatchRatingDto extends createZodDto(updateTvEpisodeWatchRatingSchema) {}
