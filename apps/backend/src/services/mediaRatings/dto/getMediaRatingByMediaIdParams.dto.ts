import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getMediaRatingByMediaIdParamsSchema = z.object({
  mediaId: z.coerce.number(),
})

export class GetMediaRatingByMediaIdParamsDto extends createZodDto(getMediaRatingByMediaIdParamsSchema) {}
