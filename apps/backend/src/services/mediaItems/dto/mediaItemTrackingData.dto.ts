import {
  MediaItemStatusNameEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaItemSiteToViewDto } from "@/services/mediaItems/dto/mediaItemSiteToView.dto"
import { MediaItemTvProgressDto } from "@/services/mediaItems/dto/mediaItemTvProgress.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

export const mediaItemTrackingDataSchema = z.object({
  id: z.string().uuid(),
  mediaItemId: z.string().uuid(),
  currentStatus: z.enum(MediaItemStatusNameEnum),
  note: z.string(),
  score: z.number().nullable().optional(),
  tvProgress: MediaItemTvProgressDto.schema,
  sitesToView: z.array(MediaItemSiteToViewDto.schema),
  createdAt: zDateTimeString,
  updatedAt: zDateTimeString,
})

export class MediaItemTrackingDataDto extends createZodDto(mediaItemTrackingDataSchema) {}
