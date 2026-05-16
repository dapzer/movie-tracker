import { MediaReviewStatus, MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"
import { UserPublicDto } from "@/services/users/dto/userPublic.dto"
import { PaginatedDto } from "@/shared/dto/paginated.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const mediaReviewSchema = z.object({
  id: z.uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  userId: z.uuid().meta({ format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" }),
  user: UserPublicDto.schema.optional(),
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  mediaDetailsId: z.uuid().meta({ format: "uuid", example: "f6b49f5d-2c8a-4f3e-9e74-7a3f7d2d5a01" }),
  mediaDetails: MediaDetailsDto.schema.optional(),
  title: z.string().meta({ example: "A fresh and stylish action film" }),
  content: z.string().meta({ example: "Great pacing and soundtrack, but the third act feels rushed." }),
  isSpoiler: z.boolean().meta({ example: false }),
  status: z.enum(MediaReviewStatus).meta({ enum: MediaReviewStatus, example: MediaReviewStatus.PUBLISHED }),
  publishedAt: zDateTimeString.optional().meta({ format: "date-time", example: "2026-05-01T12:00:00.000Z" }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-05-01T12:00:00.000Z" }),
  updatedAt: zDateTimeString.meta({ format: "date-time", example: "2026-05-01T12:10:00.000Z" }),
  likesCount: z.number().optional().meta({ example: 12 }),
  dislikesCount: z.number().optional().meta({ example: 2 }),
  likeId: z.uuid().optional().meta({ format: "uuid", example: "44f20e0e-36de-4f48-8d91-24b357f639af" }),
  dislikeId: z.uuid().optional().meta({ format: "uuid", example: "44f20e0e-36de-4f48-8d91-24b357f639af" }),
  rating: z.number().min(0).max(10).optional().meta({ minimum: 0, maximum: 10, example: 8 }),
})

const mediaReviewLikeSchema = z.object({
  id: z.uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  userId: z.uuid().meta({ format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" }),
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  mediaDetailsId: z.uuid().meta({ format: "uuid", example: "f6b49f5d-2c8a-4f3e-9e74-7a3f7d2d5a01" }),
  mediaReviewId: z.uuid().meta({ format: "uuid", example: "e9a2f5b7-c6d3-4c0a-a35f-84c7f902ad59" }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-05-01T12:00:00.000Z" }),
})

const mediaReviewDislikeSchema = z.object({
  id: z.uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  userId: z.uuid().meta({ format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" }),
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  mediaDetailsId: z.uuid().meta({ format: "uuid", example: "f6b49f5d-2c8a-4f3e-9e74-7a3f7d2d5a01" }),
  mediaReviewId: z.uuid().meta({ format: "uuid", example: "e9a2f5b7-c6d3-4c0a-a35f-84c7f902ad59" }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-05-01T12:00:00.000Z" }),
})

export class MediaReviewDto extends createZodDto(mediaReviewSchema) {}

export class MediaReviewLikeDto extends createZodDto(mediaReviewLikeSchema) {}

export class MediaReviewDislikeDto extends createZodDto(mediaReviewDislikeSchema) {}

export class MediaReviewPaginatedDto extends PaginatedDto(MediaReviewDto) {}
