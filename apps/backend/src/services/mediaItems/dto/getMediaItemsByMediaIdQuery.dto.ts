import { MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getMediaItemsByMediaIdQuerySchema = z.object({
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum }),
})

export class GetMediaItemsByMediaIdQueryDto extends createZodDto(getMediaItemsByMediaIdQuerySchema) {}
