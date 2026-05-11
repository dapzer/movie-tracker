import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const mediaItemTvProgressSchema = z.object({
  currentSeason: z.number().int(),
  currentEpisode: z.number().int(),
})

export class MediaItemTvProgressDto extends createZodDto(mediaItemTvProgressSchema) {}
