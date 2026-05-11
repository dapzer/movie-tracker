import { MediaItemStatusNameEnum, MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"
import { MediaRatingDto } from "@/services/mediaRatings/dto/mediaRating.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const mediaItemTvProgressSchema = z.object({
  currentSeason: z.number().meta({ example: 1 }),
  currentEpisode: z.number().meta({ example: 3 }),
})

const mediaItemSiteToViewSchema = z.object({
  url: z.string().meta({ example: "https://netflix.com/watch/123" }),
})

const mediaItemTrackingDataSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  mediaItemId: z.uuid().meta({ format: "uuid" }),
  currentStatus: z.enum(MediaItemStatusNameEnum).meta({ enum: MediaItemStatusNameEnum }),
  note: z.string().meta({ maxLength: 2500 }),
  score: z.number().nullable().optional().meta({ nullable: true, example: 8 }),
  tvProgress: mediaItemTvProgressSchema,
  sitesToView: z.array(mediaItemSiteToViewSchema),
  createdAt: zDateTimeString.meta({ format: "date-time" }),
  updatedAt: zDateTimeString.meta({ format: "date-time" }),
})

const mediaItemSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  mediaId: z.number().meta({ example: 550 }),
  mediaDetailsId: z.uuid().meta({ format: "uuid" }),
  mediaListId: z.uuid().meta({ format: "uuid" }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum }),
  mediaDetails: MediaDetailsDto.schema.optional(),
  mediaRating: MediaRatingDto.schema.optional(),
  trackingData: mediaItemTrackingDataSchema,
  createdAt: zDateTimeString.meta({ format: "date-time" }),
  updatedAt: zDateTimeString.meta({ format: "date-time" }),
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

export class MediaItemTvProgressDto extends createZodDto(mediaItemTvProgressSchema) {}

export class MediaItemSiteToViewDto extends createZodDto(mediaItemSiteToViewSchema) {}

export class MediaItemTrackingDataDto extends createZodDto(mediaItemTrackingDataSchema) {}

export class MediaItemDto extends createZodDto(mediaItemSchema) {}

export class MediaItemPaginatedDto extends createZodDto(mediaItemPaginatedSchema) {}

export class MediaItemsCountByStatusDto extends createZodDto(mediaItemsCountByStatusSchema) {}

MediaItemTrackingDataDto.schema.shape.tvProgress = mediaItemTvProgressSchema
MediaItemTrackingDataDto.schema.shape.sitesToView = z.array(mediaItemSiteToViewSchema)
MediaItemDto.schema.shape.trackingData = mediaItemTrackingDataSchema
MediaItemPaginatedDto.schema.shape.items = z.array(mediaItemSchema)
