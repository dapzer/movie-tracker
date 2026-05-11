import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const mediaDetailsUpdateProgressSchema = z.object({
  successfulUpdates: z.number().meta({ example: 120 }),
  failedUpdatesByApi: z.number().meta({ example: 5 }),
  failedUpdatesByDb: z.number().meta({ example: 2 }),
})

export class MediaDetailsUpdateProgressDto extends createZodDto(mediaDetailsUpdateProgressSchema) {}
