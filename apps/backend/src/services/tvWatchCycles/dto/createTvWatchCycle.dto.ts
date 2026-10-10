import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createTvWatchCycleSchema = z.object({
  mediaItemId: z.uuid().meta({ format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" }),
})

export class CreateTvWatchCycleDto extends createZodDto(createTvWatchCycleSchema) {}
