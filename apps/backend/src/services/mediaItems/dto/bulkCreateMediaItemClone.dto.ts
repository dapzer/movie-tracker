import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { CreateMediaItemCloneDto } from "@/services/mediaItems/dto/createMediaItemClone.dto"

const bulkCreateMediaItemCloneItemSchema = CreateMediaItemCloneDto.schema.extend({
  mediaItemId: z.uuid().meta({ format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" }),
})

const bulkCreateMediaItemCloneSchema = z.object({
  items: z.array(bulkCreateMediaItemCloneItemSchema).nonempty(),
})

export class BulkCreateMediaItemCloneDto extends createZodDto(bulkCreateMediaItemCloneSchema) {}
