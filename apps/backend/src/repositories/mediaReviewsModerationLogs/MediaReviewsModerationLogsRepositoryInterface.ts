import {
  MediaReviewModerationLog,
  MediaReviewModerationLogCreateBodyType,
} from "@movie-tracker/types"

export const MediaReviewsModerationLogsRepositorySymbol = Symbol("MediaReviewsModerationLogsRepository")

export interface MediaReviewsModerationLogsRepositoryInterface {
  getById: (args: {
    id: string
  }) => Promise<MediaReviewModerationLog | undefined>

  getByReviewId: (args: {
    mediaReviewId: string
  }) => Promise<MediaReviewModerationLog[]>

  create: (args: {
    moderatorId: string
  } & MediaReviewModerationLogCreateBodyType) => Promise<MediaReviewModerationLog>
}
