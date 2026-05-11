import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaListAccessLevelEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createMediaListSchema = z.object({
  accessLevel: z.enum(MediaListAccessLevelEnum).meta({ enum: MediaListAccessLevelEnum, example: MediaListAccessLevelEnum.PRIVATE }),
  title: z.preprocess(
    value => typeof value === "string" ? value.trim() : value,
    z.string().min(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT).max(MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT),
  ).meta({ minLength: MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, maxLength: MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT, example: "My Anime Watchlist" }),
  description: z.string().min(0).max(256).optional().meta({ maxLength: 256, example: "Anime I want to finish in 2026" }),
})

export class CreateMediaListDto extends createZodDto(createMediaListSchema) {}
