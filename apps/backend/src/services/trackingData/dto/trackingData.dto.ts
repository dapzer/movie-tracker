import { MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH, MediaItemStatusNameEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaItemSiteToViewDto } from "@/services/mediaItems/dto/mediaItemSiteToView.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const trackingDataSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  mediaItemId: z.uuid().meta({ format: "uuid" }),
  currentStatus: z.enum(MediaItemStatusNameEnum).meta({ enum: MediaItemStatusNameEnum }),
  note: z.string().meta({ maxLength: MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH }),
  sitesToView: z.array(MediaItemSiteToViewDto.schema),
  createdAt: zDateTimeString.meta({ format: "date-time" }),
  updatedAt: zDateTimeString.meta({ format: "date-time" }),
})

export class TrackingDataDto extends createZodDto(trackingDataSchema) {}
