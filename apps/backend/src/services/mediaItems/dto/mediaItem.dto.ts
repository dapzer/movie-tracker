import { MediaItemStatusNameEnum, MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"
import { MediaRatingDto } from "@/services/mediaRatings/dto/mediaRating.dto"
import { TrackingDataDto } from "@/services/trackingData/dto/trackingData.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const mediaItemSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  mediaId: z.number().meta({ example: 550 }),
  mediaDetailsId: z.uuid().meta({ format: "uuid" }),
  mediaListId: z.uuid().meta({ format: "uuid" }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum }),
  mediaDetails: MediaDetailsDto.schema.optional(),
  mediaRating: MediaRatingDto.schema.optional(),
  createdAt: zDateTimeString.meta({ format: "date-time" }),
  updatedAt: zDateTimeString.meta({ format: "date-time" }),
})

const mediaItemWithTrackingDataSchema = mediaItemSchema.extend({
  trackingData: TrackingDataDto.schema,
})

const mediaItemPaginatedSchema = z.object({
  items: z.array(mediaItemSchema),
  totalCount: z.number().meta({ example: 42 }),
})

const mediaItemsCountByStatusSchema = z.object({
  [MediaItemStatusNameEnum.WATCHING_NOW]: z.number().meta({ example: 5 }),
  [MediaItemStatusNameEnum.NOT_VIEWED]: z.number().meta({ example: 12 }),
  [MediaItemStatusNameEnum.WAIT_NEW_PART]: z.number().meta({ example: 3 }),
  [MediaItemStatusNameEnum.VIEWED]: z.number().meta({ example: 20 }),
  total: z.number().meta({ example: 40 }),
})

export class MediaItemDto extends createZodDto(mediaItemSchema) {}

export class MediaItemWithTrackingDataDto extends createZodDto(mediaItemWithTrackingDataSchema) {}

export class MediaItemPaginatedDto extends createZodDto(mediaItemPaginatedSchema) {}

export class MediaItemsCountByStatusDto extends createZodDto(mediaItemsCountByStatusSchema) {}

MediaItemPaginatedDto.schema.shape.items = z.array(mediaItemSchema)
