import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaItemStatusNameEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const processBucketSchema = z.object({
  mediaListId: z.uuid().optional().meta({ format: "uuid", description: "Existing media list id" }),
  newListTitle: z.string().min(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT).max(MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT).optional().meta({ description: "Title for new media list" }),
  status: z.enum(MediaItemStatusNameEnum).meta({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.VIEWED }),
}).refine(value => value.mediaListId || value.newListTitle, {
  message: "Either mediaListId or newListTitle must be provided",
})

const processDataImportSchema = z.object({
  watched: processBucketSchema.optional(),
  watchList: processBucketSchema.optional(),
  lists: z.object({
    status: z.enum(MediaItemStatusNameEnum).meta({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.VIEWED }),
  }).optional(),
})

export class ProcessDataImportDto extends createZodDto(processDataImportSchema) {}
