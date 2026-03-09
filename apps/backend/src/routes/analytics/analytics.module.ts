import { Module } from "@nestjs/common"
import { DrizzleMediaDetailsRepository } from "@/repositories/mediaDetails/DrizzleMediaDetailsRepository"
import { MediaDetailsRepositorySymbol } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { AnalyticsController } from "@/routes/analytics/analytics.controller"
import { AnalyticsService } from "@/routes/analytics/analytics.service"

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    {
      provide: MediaDetailsRepositorySymbol,
      useClass: DrizzleMediaDetailsRepository,
    },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
    {
      provide: UserRepositorySymbol,
      useClass: DrizzleUserRepository,
    },
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
  ],
})
export class AnalyticsModule {}
