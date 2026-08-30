import { MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getMediaReviewByCurrentUserAndMediaIdQuerySchema = z.object({
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
})

export class GetMediaReviewByCurrentUserAndMediaIdQueryDto extends createZodDto(getMediaReviewByCurrentUserAndMediaIdQuerySchema) {}
