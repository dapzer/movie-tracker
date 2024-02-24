import { Module } from '@nestjs/common';
import { AnalyticsService } from '@/routes/analytics/analytics.service';
import { AnalyticsController } from '@/routes/analytics/analytics.controller';
import { MediaDetailsRepositorySymbol } from '@/repositories/mediaDetails/MediaDetailsRepositoryInterface';
import { PrismaMediaDetailsRepository } from '@/repositories/mediaDetails/PrismaMediaDetailsRepository';
import { MediaItemRepositorySymbol } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { PrismaMediaItemRepository } from '@/repositories/mediaItem/PrismaMediaItemRepository';
import { UserRepositorySymbol } from '@/repositories/user/UserRepositoryInterface';
import { PrismaUserRepository } from '@/repositories/user/PrismaUserRepository';
import { MediaListRepositorySymbol } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { PrismaMediaListRepository } from '@/repositories/mediaList/PrismaMediaListRepository';

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
