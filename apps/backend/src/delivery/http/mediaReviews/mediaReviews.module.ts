import { Module } from "@nestjs/common"
import { MediaReviewsController } from "@/delivery/http/mediaReviews/mediaReviews.controller"
import { MediaReviewsServiceModule } from "@/services/mediaReviews/mediaReviews.module"

@Module({
  imports: [MediaReviewsServiceModule],
  controllers: [MediaReviewsController],
})
export class MediaReviewsModule {}
