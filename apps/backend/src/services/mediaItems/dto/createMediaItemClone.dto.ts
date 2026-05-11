import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createMediaItemCloneSchema = z.object({
  mediaListId: z.string().uuid().meta({ format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" }),
  isSaveCreationDate: z.boolean().meta({ example: true }),
})

export class CreateMediaItemCloneDto extends createZodDto(createMediaItemCloneSchema) {}
