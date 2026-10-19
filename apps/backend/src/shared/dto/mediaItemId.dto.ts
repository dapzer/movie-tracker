import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const mediaItemIdSchema = z.object({
  mediaItemId: z.uuid().meta({ format: "uuid" }),
})

export class MediaItemIdDto extends createZodDto(mediaItemIdSchema) {}
