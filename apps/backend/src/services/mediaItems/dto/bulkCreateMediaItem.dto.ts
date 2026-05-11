import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { CreateMediaItemDto } from "@/services/mediaItems/dto/createMediaItem.dto"

const bulkCreateMediaItemSchema = z.object({
  items: z.array(CreateMediaItemDto.schema).nonempty(),
})

export class BulkCreateMediaItemDto extends createZodDto(bulkCreateMediaItemSchema) {}
