import {
  MediaReviewModerationLogAction,
  MediaReviewModerationLogCreateBodyType,
  MediaReviewModerationLogReason,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const moderateMediaReviewSchema = z.object({
  mediaReviewId: z.uuid().meta({ format: "uuid", example: "e9a2f5b7-c6d3-4c0a-a35f-84c7f902ad59" }),
  action: z.enum(MediaReviewModerationLogAction).meta({
    enum: MediaReviewModerationLogAction,
    example: MediaReviewModerationLogAction.APPROVED,
  }),
  reason: z.enum(MediaReviewModerationLogReason).optional().meta({
    enum: MediaReviewModerationLogReason,
    example: MediaReviewModerationLogReason.SPAM,
  }),
  comment: z.string().optional().meta({ example: "Please rewrite the intro to focus on the movie." }),
}).superRefine((value, ctx) => {
  if (
    [MediaReviewModerationLogAction.REJECTED, MediaReviewModerationLogAction.CHANGES_REQUESTED].includes(value.action)
    && !value.reason
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["reason"],
      message: "Reason is required for rejected and changes requested actions.",
    })
  }
})

export class ModerateMediaReviewDto extends createZodDto(moderateMediaReviewSchema) implements MediaReviewModerationLogCreateBodyType {}

export type ModerateMediaReviewType = z.infer<typeof moderateMediaReviewSchema>
