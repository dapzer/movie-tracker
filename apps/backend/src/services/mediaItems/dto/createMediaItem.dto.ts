import { MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH, MediaItemStatusNameEnum, MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const createMediaItemSchema = z.object({
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  mediaId: z.number().meta({ example: 550 }),
  mediaListId: z.uuid().meta({ format: "uuid" }),
  currentStatus: z
    .enum(MediaItemStatusNameEnum)
    .meta({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.WATCHING_NOW }),
  // TODO: Think about  to allow this field only for iternal use
  note: z.string().max(MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH).optional(),
  tvProgress: z.object({
    currentSeason: z.number().int().min(1),
    currentEpisode: z.number().int().min(1),
  }).optional(),
  createdAt: zDateTimeString.optional(),
})

export class CreateMediaItemDto extends createZodDto(createMediaItemSchema) {}
