import { MediaListAccessLevelEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginatedDto } from "@/shared/dto/paginated.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const mediaListSchema = z.object({
  id: z.string().uuid().meta({ example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" }),
  humanFriendlyId: z.string().meta({ example: "anime-watchlist-2026" }),
  userId: z.string().uuid().meta({ example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" }),
  isSystem: z.boolean().meta({ example: false }),
  accessLevel: z.enum(MediaListAccessLevelEnum).meta({ enum: MediaListAccessLevelEnum, example: MediaListAccessLevelEnum.PRIVATE }),
  title: z.string().meta({ example: "My Anime List" }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-30T12:34:56.000Z" }),
  updatedAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-30T13:00:00.000Z" }),
})

export class MediaListDto extends createZodDto(mediaListSchema) {}

export class MediaListsPaginatedDto extends PaginatedDto(MediaListDto) {}
