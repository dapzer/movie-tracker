import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { TvEpisodeWatchDto } from "@/services/tvEpisodeWatches/dto/tvEpisodeWatch.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const tvWatchCycleSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  mediaItemId: z.uuid().meta({ format: "uuid" }),
  userId: z.uuid().meta({ format: "uuid" }),
  mediaId: z.number().meta({ example: 1399 }),
  cycleNumber: z.number().int().meta({ example: 1 }),
  startedAt: zDateTimeString.meta({ format: "date-time" }),
  finishedAt: zDateTimeString.nullable().meta({ format: "date-time" }),
})

const tvWatchCycleWithEpisodesSchema = tvWatchCycleSchema.extend({
  episodeWatches: z.array(TvEpisodeWatchDto.schema),
})

export class TvWatchCycleDto extends createZodDto(tvWatchCycleSchema) {}

export class TvWatchCycleWithEpisodesDto extends createZodDto(tvWatchCycleWithEpisodesSchema) {}
