import { MediaReviewModerationLogAction, MediaReviewModerationLogReason } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const mediaReviewModerationLogSchema = z.object({
  id: z.uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  mediaReviewId: z.uuid().meta({ format: "uuid", example: "e9a2f5b7-c6d3-4c0a-a35f-84c7f902ad59" }),
  moderatorId: z.uuid().nullable().optional().meta({
    format: "uuid",
    nullable: true,
    example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a",
  }),
  action: z.enum(MediaReviewModerationLogAction).meta({
    enum: MediaReviewModerationLogAction,
    example: MediaReviewModerationLogAction.APPROVED,
  }),
  reason: z.enum(MediaReviewModerationLogReason).nullable().optional().meta({
    enum: MediaReviewModerationLogReason,
    nullable: true,
    example: MediaReviewModerationLogReason.SPAM,
  }),
  comment: z.string().nullable().optional().meta({ nullable: true, example: "Please remove spoilers in the first paragraph." }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-05-01T12:00:00.000Z" }),
})

export class MediaReviewModerationLogDto extends createZodDto(mediaReviewModerationLogSchema) {}
