import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const bulkDeleteMediaItemSchema = z.object({
  ids: z.array(z.string().uuid()).nonempty().meta({ format: "uuid", example: ["a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021"] }),
})

export class BulkDeleteMediaItemDto extends createZodDto(bulkDeleteMediaItemSchema) {}
