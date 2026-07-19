import type { MediaReviewModerationLog } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  GetMediaReviewModerationLogsArgs,
  ModerateMediaReviewArgs,
} from "~/api/mediaReviewModeration/mediaReviewModerationApiTypes"
import { api } from "~/api/instance"

export function getMediaReviewModerationLogsApi(args: GetMediaReviewModerationLogsArgs, options?: RequestOptions) {
  return api.get<MediaReviewModerationLog[]>(`media-review-moderation/${args.mediaReviewId}`, options)
}

export function moderateMediaReviewApi(args: ModerateMediaReviewArgs, options?: RequestOptions) {
  return api.post<MediaReviewModerationLog>(`media-review-moderation`, args, options)
}
