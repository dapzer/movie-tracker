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
  lists: z.array(z.object({
    id: z.string().min(1).meta({ description: "Imported list id from data import result" }),
    mediaListId: z.uuid().optional().meta({ format: "uuid", description: "Existing media list id" }),
    status: z.enum(MediaItemStatusNameEnum).meta({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.VIEWED }),
  })).optional().superRefine((lists, ctx) => {
    if (!lists) {
      return
    }

    const seenIds = new Set<string>()

    for (const [index, list] of lists.entries()) {
      if (seenIds.has(list.id)) {
        ctx.addIssue({
          code: "custom",
          message: "List id must be unique",
          path: [index, "id"],
        })
      }
      seenIds.add(list.id)
    }
  }),
})

export class ProcessDataImportDto extends createZodDto(processDataImportSchema) {}
