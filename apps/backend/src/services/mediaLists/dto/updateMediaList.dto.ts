import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaListAccessLevelEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const updateMediaListSchema = z.object({
  accessLevel: z.enum(MediaListAccessLevelEnum).meta({ enum: MediaListAccessLevelEnum, example: MediaListAccessLevelEnum.PUBLIC }),
  title: z.preprocess(
    (value) => {
      if (value === null) {
        return null
      }

      if (typeof value === "string") {
        return value.trim()
      }

      return value
    },
    z.string().min(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT).max(MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT).nullable(),
  ).optional().meta({ example: "My favorite anime list" }),
  description: z.string().min(0).max(256).optional().meta({ example: "List of shows I plan to watch" }),
})

export class UpdateMediaListDto extends createZodDto(updateMediaListSchema) {}
