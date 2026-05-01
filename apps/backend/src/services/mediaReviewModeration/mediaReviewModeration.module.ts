import { Module } from "@nestjs/common"
import { DrizzleMediaReviewRepository } from "@/repositories/mediaReview/DrizzleMediaReviewRepository"
import { MediaReviewRepositorySymbol } from "@/repositories/mediaReview/MediaReviewRepositoryInterface"
import { DrizzleMediaReviewsModerationLogsRepository } from "@/repositories/mediaReviewsModerationLogs/DrizzleMediaReviewsModerationLogsRepository"
import { MediaReviewsModerationLogsRepositorySymbol } from "@/repositories/mediaReviewsModerationLogs/MediaReviewsModerationLogsRepositoryInterface"
import { MediaReviewModerationService } from "@/services/mediaReviewModeration/mediaReviewModeration.service"

@Module({
  providers: [
    MediaReviewModerationService,
    { provide: MediaReviewRepositorySymbol, useClass: DrizzleMediaReviewRepository },
    { provide: MediaReviewsModerationLogsRepositorySymbol, useClass: DrizzleMediaReviewsModerationLogsRepository },
  ],
  exports: [MediaReviewModerationService],
})
export class MediaReviewModerationServiceModule {}
