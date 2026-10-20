import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const tvEpisodeWatchSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  watchCycleId: z.uuid().meta({ format: "uuid" }),
  userId: z.uuid().meta({ format: "uuid" }),
  mediaId: z.number().meta({ example: 1399 }),
  mediaDetailsId: z.uuid().nullable().meta({ format: "uuid" }),
  seasonNumber: z.number().int().meta({ example: 1 }),
  episodeNumber: z.number().int().meta({ example: 3 }),
  watchedAt: zDateTimeString.meta({ format: "date-time" }),
})

export class TvEpisodeWatchDto extends createZodDto(tvEpisodeWatchSchema) {}
