import type { MediaReviewModerationLogCreateBodyType } from "@movie-tracker/types"

export interface GetMediaReviewModerationLogsArgs {
  mediaReviewId: string
}

export type ModerateMediaReviewArgs = MediaReviewModerationLogCreateBodyType
