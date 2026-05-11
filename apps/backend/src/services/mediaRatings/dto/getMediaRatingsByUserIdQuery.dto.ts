import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getMediaRatingsByUserIdQuerySchema = z.object({
  userId: z.string().uuid().meta({ format: "uuid" }),
})

export class GetMediaRatingsByUserIdQueryDto extends createZodDto(getMediaRatingsByUserIdQuerySchema) {}
