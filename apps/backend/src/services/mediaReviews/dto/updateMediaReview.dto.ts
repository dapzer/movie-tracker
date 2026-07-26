import {
  MEDIA_REVIEW_CONTENT_MAX_LENGTH,
  MEDIA_REVIEW_CONTENT_MIN_LENGTH,
  MEDIA_REVIEW_TITLE_MAX_LENGTH,
  MediaReviewStatus,
  MediaReviewUpdateBodyType,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const updateMediaReviewSchema = z.object({
  title: z.string().max(MEDIA_REVIEW_TITLE_MAX_LENGTH).optional().meta({
    maxLength: MEDIA_REVIEW_TITLE_MAX_LENGTH,
    example: "A fresh and stylish action film",
  }),
  content: z.string().min(MEDIA_REVIEW_CONTENT_MIN_LENGTH).max(MEDIA_REVIEW_CONTENT_MAX_LENGTH).optional().meta({
    minLength: MEDIA_REVIEW_CONTENT_MIN_LENGTH,
    maxLength: MEDIA_REVIEW_CONTENT_MAX_LENGTH,
    example: "Great pacing and soundtrack, but the third act feels rushed.",
  }),
  isSpoiler: z.boolean().optional().meta({ example: false }),
  status: z.enum([MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING]).optional().meta({ enum: [MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING], example: MediaReviewStatus.PENDING }),
  publishedAt: zDateTimeString.optional().meta({ format: "date-time", example: "2026-05-01T12:00:00.000Z" }),
})

export class UpdateMediaReviewDto extends createZodDto(updateMediaReviewSchema) implements Partial<MediaReviewUpdateBodyType> {}

export type UpdateMediaReviewType = z.infer<typeof updateMediaReviewSchema>
