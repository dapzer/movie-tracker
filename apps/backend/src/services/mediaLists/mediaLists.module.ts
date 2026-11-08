import { Module } from "@nestjs/common"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { DrizzleMediaReviewRepository } from "@/repositories/mediaReview/DrizzleMediaReviewRepository"
import { MediaReviewRepositorySymbol } from "@/repositories/mediaReview/MediaReviewRepositoryInterface"
import { DrizzleTrackingDataRepository } from "@/repositories/trackingData/DrizzleTrackingDataRepository"
import { TrackingDataRepositorySymbol } from "@/repositories/trackingData/TrackingDataRepositoryInterface"
import { DrizzleTvWatchCycleRepository } from "@/repositories/tvWatchCycle/DrizzleTvWatchCycleRepository"
import { TvWatchCycleRepositorySymbol } from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import { MediaListsService } from "@/services/mediaLists/mediaLists.service"
import { NotificationsServiceModule } from "@/services/notifications/notifications.module"
import { RecommendationsServiceModule } from "@/services/recommendations/recommendations.module"
import { TvWatchCyclesServiceModule } from "@/services/tvWatchCycles/tvWatchCycles.module"

@Module({
  imports: [NotificationsServiceModule, TvWatchCyclesServiceModule, RecommendationsServiceModule],
  providers: [
    MediaListsService,
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
    { provide: MediaReviewRepositorySymbol, useClass: DrizzleMediaReviewRepository },
    { provide: TrackingDataRepositorySymbol, useClass: DrizzleTrackingDataRepository },
    { provide: TvWatchCycleRepositorySymbol, useClass: DrizzleTvWatchCycleRepository },
  ],
  exports: [MediaListsService],
})
export class MediaListsServiceModule {}
