import { MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createMediaRatingSchema = z.object({
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  rating: z.number().min(0).max(10).meta({ minimum: 0, maximum: 10, example: 8 }),
})

export class CreateMediaRatingDto extends createZodDto(createMediaRatingSchema) {}
