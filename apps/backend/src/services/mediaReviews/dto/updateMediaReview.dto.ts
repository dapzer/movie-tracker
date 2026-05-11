import { MediaReviewStatus, MediaReviewUpdateBodyType } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const updateMediaReviewSchema = z.object({
  isSpoiler: z.boolean().optional().meta({ example: false }),
  status: z.enum([MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING]).optional().meta({ enum: [MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING], example: MediaReviewStatus.PENDING }),
  publishedAt: zDateTimeString.optional().meta({ format: "date-time", example: "2026-05-01T12:00:00.000Z" }),
})

export class UpdateMediaReviewDto extends createZodDto(updateMediaReviewSchema) implements Partial<MediaReviewUpdateBodyType> {}

export type UpdateMediaReviewType = z.infer<typeof updateMediaReviewSchema>
