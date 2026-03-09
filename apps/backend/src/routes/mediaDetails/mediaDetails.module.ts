import { Module } from "@nestjs/common"
import { DrizzleMediaDetailsRepository } from "@/repositories/mediaDetails/DrizzleMediaDetailsRepository"
import { MediaDetailsRepositorySymbol } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import {
  DrizzleReleaseSubscriptionRepository,
} from "@/repositories/releaseSubscription/DrizzleReleaseSubscriptionRepository"
import {
  ReleaseSubscriptionRepositorySymbol,
} from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { MediaDetailsController } from "@/routes/mediaDetails/mediaDetails.controller"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"
import { NotificationModule } from "@/routes/notification/notification.module"

@Module({
  imports: [NotificationModule],
  controllers: [MediaDetailsController],
  providers: [
    MediaDetailsService,
    {
      provide: MediaDetailsRepositorySymbol,
      useClass: DrizzleMediaDetailsRepository,
    },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
    { provide: ReleaseSubscriptionRepositorySymbol, useClass: DrizzleReleaseSubscriptionRepository },
  ],
  exports: [MediaDetailsService],
})
export class MediaDetailsModule {}
