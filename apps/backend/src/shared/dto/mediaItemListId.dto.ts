import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const mediaItemListIdSchema = z.object({
  mediaListId: z.string().meta({ example: "1b9e3d26-97d6-45ce-bc43-2e0296260759" }),
})

export class MediaItemListIdDto extends createZodDto(mediaItemListIdSchema) {}
