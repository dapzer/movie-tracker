import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const updateMediaItemSchema = z.object({
  mediaListId: z
    .string()
    .uuid()
    .optional()
    .meta({ format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" }),
  mediaDetailsId: z
    .string()
    .uuid()
    .optional()
    .meta({ format: "uuid", example: "f6b49f5d-2c8a-4f3e-9e74-7a3f7d2d5a01" }),
})

export class UpdateMediaItemDto extends createZodDto(updateMediaItemSchema) {}
