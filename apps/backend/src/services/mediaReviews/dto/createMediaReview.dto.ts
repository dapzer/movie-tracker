import {
  MEDIA_REVIEW_CONTENT_MAX_LENGTH,
  MEDIA_REVIEW_CONTENT_MIN_LENGTH,
  MEDIA_REVIEW_TITLE_MAX_LENGTH,
  MediaReviewCreateBodyType,
  MediaReviewStatus,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createMediaReviewStatusValues = [MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING] as const

const createMediaReviewSchema = z.object({
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  title: z.string().min(1).max(MEDIA_REVIEW_TITLE_MAX_LENGTH).optional().meta({
    maxLength: MEDIA_REVIEW_TITLE_MAX_LENGTH,
    example: "A fresh and stylish action film",
  }),
  content: z.string().min(MEDIA_REVIEW_CONTENT_MIN_LENGTH).max(MEDIA_REVIEW_CONTENT_MAX_LENGTH).meta({
    minLength: MEDIA_REVIEW_CONTENT_MIN_LENGTH,
    maxLength: MEDIA_REVIEW_CONTENT_MAX_LENGTH,
    example: "Great pacing and soundtrack, but the third act feels rushed.",
  }),
  status: z.enum(createMediaReviewStatusValues).meta({
    enum: createMediaReviewStatusValues,
    example: MediaReviewStatus.DRAFT,
  }),
  isSpoiler: z.boolean().meta({ example: false }),
})

export class CreateMediaReviewDto extends createZodDto(createMediaReviewSchema) implements Omit<MediaReviewCreateBodyType, "mediaDetailsId"> {}

export type CreateMediaReviewType = z.infer<typeof createMediaReviewSchema>
