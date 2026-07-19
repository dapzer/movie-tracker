import { MediaReviewModerationLogAction, MediaReviewStatus, NotificationTypeEnum } from "@movie-tracker/types"
import { Inject, Injectable, Logger } from "@nestjs/common"
import {
  MediaReviewRepositoryInterface,
  MediaReviewRepositorySymbol,
} from "@/repositories/mediaReview/MediaReviewRepositoryInterface"
import {
  MediaReviewsModerationLogsRepositoryInterface,
  MediaReviewsModerationLogsRepositorySymbol,
} from "@/repositories/mediaReviewsModerationLogs/MediaReviewsModerationLogsRepositoryInterface"
import { ModerateMediaReviewDto } from "@/services/mediaReviewModeration/dto/moderateMediaReview.dto"
import { NotificationsService } from "@/services/notifications/notifications.service"
import { MediaReviewNotFoundError } from "@/shared/errors/mediaReview"

@Injectable()
export class MediaReviewModerationService {
  private readonly logger = new Logger("MediaReviewModerationService")

  constructor(
    @Inject(MediaReviewRepositorySymbol)
    private readonly mediaReviewRepository: MediaReviewRepositoryInterface,
    @Inject(MediaReviewsModerationLogsRepositorySymbol)
    private readonly moderationLogsRepository: MediaReviewsModerationLogsRepositoryInterface,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getLogsByReviewId(args: { mediaReviewId: string }) {
    return this.moderationLogsRepository.getByReviewId({ mediaReviewId: args.mediaReviewId })
  }

  async moderate(args: { body: ModerateMediaReviewDto, currentUserId: string }) {
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

    const updatedMediaReview = await this.mediaReviewRepository.update({
      id: args.body.mediaReviewId,
      status: newStatus,
      publishedAt: isApproved ? new Date() : undefined,
      isSpoiler,
    })

    if (updatedMediaReview) {
      await this.notificationsService.create({
        userId: mediaReview.userId,
        type: NotificationTypeEnum.MEDIA_REVIEW_MODERATION_UPDATE,
        meta: {
          mediaReviewId: mediaReview.id,
          mediaDetailsId: updatedMediaReview.mediaDetailsId,
          action: args.body.action,
          reason: args.body.reason,
        },
        createdAt: updatedMediaReview.updatedAt,
      }).catch((err) => {
        this.logger.error(err, "Failed to create media review moderation update notification")
      })
    }

    return this.moderationLogsRepository.create({
      mediaReviewId: args.body.mediaReviewId,
      moderatorId: args.currentUserId,
      action: args.body.action,
      reason: args.body.reason ?? null,
      comment: args.body.comment ?? null,
      reviewTitleSnapshot: mediaReview.title ?? null,
      reviewContentSnapshot: mediaReview.content,
      reviewIsSpoilerSnapshot: mediaReview.isSpoiler,
    })
  }
}
