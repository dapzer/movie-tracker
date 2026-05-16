export interface MediaReviewModerationLog {
  id: string
  mediaReviewId: string
  moderatorId: string | null
  action: MediaReviewModerationLogAction
  reason: MediaReviewModerationLogReason | null
  comment: string | null
  createdAt: Date
}

export type MediaReviewModerationLogCreateBodyType = Pick<
  MediaReviewModerationLog,
  "mediaReviewId" | "action"
> & Partial<Pick<
  MediaReviewModerationLog,
  "reason" | "comment"
>>

export enum MediaReviewModerationLogAction {
  APPROVED = "APPROVED",
  APPROVED_WITH_SPOILER_MARK = "APPROVED_WITH_SPOILER_MARK",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
  REJECTED = "REJECTED",
}

export enum MediaReviewModerationLogReason {
  OFF_TOPIC = "OFF_TOPIC",
  SPAM = "SPAM",
  TOXICITY = "TOXICITY",
  LOW_EFFORT_JUNK = "LOW_EFFORT_JUNK",
  OTHER = "OTHER",
}
