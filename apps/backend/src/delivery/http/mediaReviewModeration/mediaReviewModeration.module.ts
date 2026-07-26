import { Module } from "@nestjs/common"
import { MediaReviewModerationController } from "@/delivery/http/mediaReviewModeration/mediaReviewModeration.controller"
import { MediaReviewModerationServiceModule } from "@/services/mediaReviewModeration/mediaReviewModeration.module"

@Module({
  imports: [MediaReviewModerationServiceModule],
  controllers: [MediaReviewModerationController],
})
export class MediaReviewModerationModule {}
