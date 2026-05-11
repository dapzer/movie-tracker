import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const mediaListLikeSchema = z.object({
  id: z.string().uuid().meta({ example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" }),
  mediaListId: z.string().uuid().meta({ example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" }),
  userId: z.string().uuid().meta({ example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-30T12:34:56.000Z" }),
  mediaListHumanFriendlyId: z.string().meta({ example: "anime-watchlist-2026" }),
})

export class MediaListLikeDto extends createZodDto(mediaListLikeSchema) {}
