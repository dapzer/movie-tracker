import { MediaItemStatusNameEnum, MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createMediaItemSchema = z.object({
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  mediaId: z.number().meta({ example: 550 }),
  mediaListId: z.string().uuid().meta({ format: "uuid" }),
  currentStatus: z
    .enum(MediaItemStatusNameEnum)
    .meta({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.WATCHING_NOW }),
})

export class CreateMediaItemDto extends createZodDto(createMediaItemSchema) {}
