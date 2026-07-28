import { Module } from "@nestjs/common"
import { MediaReviewsController } from "@/delivery/http/mediaReviews/mediaReviews.controller"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { MediaReviewsServiceModule } from "@/services/mediaReviews/mediaReviews.module"

@Module({
  imports: [MediaReviewsServiceModule],
  controllers: [MediaReviewsController],
  providers: [ThrottlerBehindProxyGuard],
})
export class MediaReviewsModule {}
