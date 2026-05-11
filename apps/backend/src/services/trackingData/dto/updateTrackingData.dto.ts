import {
  MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH,
  MediaItemStatusNameEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaItemSiteToViewDto } from "@/services/mediaItems/dto/mediaItemSiteToView.dto"
import { MediaItemTvProgressDto } from "@/services/mediaItems/dto/mediaItemTvProgress.dto"

const updateTrackingDataSchema = z.object({
  currentStatus: z.enum(MediaItemStatusNameEnum).meta({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.WATCHING_NOW }),
  note: z.string().max(MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH).meta({ example: "Great pacing, strong character development", maxLength: MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH }),
  score: z.number().nullable().optional().meta({ example: 8.5, nullable: true }),
  tvProgress: MediaItemTvProgressDto.schema,
  sitesToView: z.array(MediaItemSiteToViewDto.schema),
})

export class UpdateTrackingDataDto extends createZodDto(updateTrackingDataSchema) {}
