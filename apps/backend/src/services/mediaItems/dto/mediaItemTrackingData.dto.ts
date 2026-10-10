import {
  MediaItemStatusNameEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaItemSiteToViewDto } from "@/services/mediaItems/dto/mediaItemSiteToView.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

export const mediaItemTrackingDataSchema = z.object({
  id: z.uuid(),
  mediaItemId: z.uuid(),
  currentStatus: z.enum(MediaItemStatusNameEnum),
  note: z.string(),
  sitesToView: z.array(MediaItemSiteToViewDto.schema),
  createdAt: zDateTimeString,
  updatedAt: zDateTimeString,
})

export class MediaItemTrackingDataDto extends createZodDto(mediaItemTrackingDataSchema) {}
