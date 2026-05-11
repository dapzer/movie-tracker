import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getMediaItemsByMediaIdParamsSchema = z.object({
  mediaId: z.coerce.number(),
})

export class GetMediaItemsByMediaIdParams extends createZodDto(getMediaItemsByMediaIdParamsSchema) {}
