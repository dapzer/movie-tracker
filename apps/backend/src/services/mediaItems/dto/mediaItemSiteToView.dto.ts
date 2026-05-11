import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const mediaItemSiteToViewSchema = z.object({
  url: z.string(),
})

export class MediaItemSiteToViewDto extends createZodDto(mediaItemSiteToViewSchema) {}
