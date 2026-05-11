import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { UpdateMediaItemDto } from "@/services/mediaItems/dto/updateMediaItem.dto"

const bulkUpdateMediaItemSchema = z.object({
  id: z.uuid(),
  data: UpdateMediaItemDto.schema,
})

const bulkUpdateMediaItemsSchema = z.object({
  items: z.array(bulkUpdateMediaItemSchema).nonempty(),
})

export class BulkUpdateMediaItemDto extends createZodDto(bulkUpdateMediaItemSchema) {}

export class BulkUpdateMediaItemsDto extends createZodDto(bulkUpdateMediaItemsSchema) {}
