import { MediaDetailsRepositorySymbol } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { PrismaMediaDetailsRepository } from "@/repositories/mediaDetails/PrismaMediaDetailsRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { PrismaMediaItemRepository } from "@/repositories/mediaItem/PrismaMediaItemRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { PrismaMediaListRepository } from "@/repositories/mediaList/PrismaMediaListRepository"
import { PrismaUserRepository } from "@/repositories/user/PrismaUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { AnalyticsController } from "@/routes/analytics/analytics.controller"
import { AnalyticsService } from "@/routes/analytics/analytics.service"
import { Module } from "@nestjs/common"

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    {
      provide: MediaDetailsRepositorySymbol,
      useClass: PrismaMediaDetailsRepository,
    },
    { provide: MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository },
    {
      provide: UserRepositorySymbol,
      useClass: PrismaUserRepository,
    },
    { provide: MediaListRepositorySymbol, useClass: PrismaMediaListRepository },
  ],
})
export class AnalyticsModule {}
