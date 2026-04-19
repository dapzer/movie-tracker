import { MediaReviewModerationLogAction, MediaReviewStatus, UserType } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  MediaReviewRepositoryInterface,
  MediaReviewRepositorySymbol,
} from "@/repositories/mediaReview/MediaReviewRepositoryInterface"
import {
  MediaReviewsModerationLogsRepositoryInterface,
  MediaReviewsModerationLogsRepositorySymbol,
} from "@/repositories/mediaReviewsModerationLogs/MediaReviewsModerationLogsRepositoryInterface"
import { ModerateMediaReviewDto } from "@/services/mediaReviewModeration/dto/moderateMediaReview.dto"
import { MediaReviewNotFoundError } from "@/shared/errors/mediaReview"

@Injectable()
export class MediaReviewModerationService {
  constructor(
    @Inject(MediaReviewRepositorySymbol)
    private readonly mediaReviewRepository: MediaReviewRepositoryInterface,
    @Inject(MediaReviewsModerationLogsRepositorySymbol)
    private readonly moderationLogsRepository: MediaReviewsModerationLogsRepositoryInterface,
  ) {}

  async getLogsByReviewId(args: { mediaReviewId: string, currentUser: UserType }) {
    return this.moderationLogsRepository.getByReviewId({ mediaReviewId: args.mediaReviewId })
  }

  async moderate(args: { body: ModerateMediaReviewDto, currentUser: UserType }) {
    const mediaReview = await this.mediaReviewRepository.getById({ id: args.body.mediaReviewId })

    if (!mediaReview) {
      throw new MediaReviewNotFoundError({ mediaReviewId: args.body.mediaReviewId })
    }

    const statusMap: Record<MediaReviewModerationLogAction, MediaReviewStatus> = {
      [MediaReviewModerationLogAction.APPROVED]: MediaReviewStatus.PUBLISHED,
      [MediaReviewModerationLogAction.APPROVED_WITH_SPOILER_MARK]: MediaReviewStatus.PUBLISHED,
      [MediaReviewModerationLogAction.CHANGES_REQUESTED]: MediaReviewStatus.DRAFT,
      [MediaReviewModerationLogAction.REJECTED]: MediaReviewStatus.REMOVED,
    }

    const newStatus = statusMap[args.body.action]
    const isApproved = args.body.action === MediaReviewModerationLogAction.APPROVED
      || args.body.action === MediaReviewModerationLogAction.APPROVED_WITH_SPOILER_MARK
    const isSpoiler = args.body.action === MediaReviewModerationLogAction.APPROVED_WITH_SPOILER_MARK
      ? true
      : mediaReview.isSpoiler

    await this.mediaReviewRepository.update({
      id: args.body.mediaReviewId,
      status: newStatus,
      publishedAt: isApproved ? new Date() : undefined,
      isSpoiler,
    })

    return this.moderationLogsRepository.create({
      mediaReviewId: args.body.mediaReviewId,
      moderatorId: args.currentUser.id,
      action: args.body.action,
      reason: args.body.reason ?? null,
      comment: args.body.comment ?? null,
    })
  }
}
