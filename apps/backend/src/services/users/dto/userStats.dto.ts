import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const userStatsSchema = z.object({
  mediaListCount: z.number().meta({ example: 12 }),
  mediaRatingsCount: z.number().optional().meta({ example: 45 }),
  mediaListLikeCount: z.number().meta({ example: 30 }),
})

export class UserStatsDto extends createZodDto(userStatsSchema) {}
