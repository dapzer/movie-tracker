import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaItemStatusNameEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createMediaListCloneSchema = z.object({
  selectedStatuses: z.array(z.enum(MediaItemStatusNameEnum)).meta({ enum: MediaItemStatusNameEnum, isArray: true, example: [
    MediaItemStatusNameEnum.WATCHING_NOW,
    MediaItemStatusNameEnum.VIEWED,
  ] }),
  isKeepStatus: z.boolean().meta({ example: true }),
  title: z.preprocess(
    value => typeof value === "string" ? value.trim() : value,
    z.string().min(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT).max(MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT),
  ).meta({ minLength: MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, maxLength: MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT, example: "Cloned Anime List" }),
})

export class CreateMediaListCloneDto extends createZodDto(createMediaListCloneSchema) {}
