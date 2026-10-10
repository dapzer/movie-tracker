import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const tvEpisodeRefSchema = z.object({
  seasonNumber: z.number().int().min(0).meta({ example: 1 }),
  episodeNumber: z.number().int().min(1).meta({ example: 3 }),
})

const createTvEpisodeWatchSchema = tvEpisodeRefSchema.extend({
  watchCycleId: z.uuid().meta({ format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" }),
})

const bulkCreateTvEpisodeWatchSchema = z.object({
  watchCycleId: z.uuid().meta({ format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" }),
  episodes: z.array(tvEpisodeRefSchema).nonempty(),
})

export class CreateTvEpisodeWatchDto extends createZodDto(createTvEpisodeWatchSchema) {}

export class BulkCreateTvEpisodeWatchDto extends createZodDto(bulkCreateTvEpisodeWatchSchema) {}
