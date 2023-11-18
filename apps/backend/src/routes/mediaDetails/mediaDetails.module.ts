import { Module } from '@nestjs/common';
import { MediaDetailsController } from '@/routes/mediaDetails/mediaDetails.controller';
import { MediaDetailsService } from '@/routes/mediaDetails/mediaDetails.service';
import { PrismaMediaDetailsRepository } from '@/repositories/mediaDetails/PrismaMediaDetailsRepository';
import { MediaDetailsRepositorySymbol } from '@/repositories/mediaDetails/MediaDetailsRepositoryInterface';
import { MediaItemRepositorySymbol } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { PrismaMediaItemRepository } from '@/repositories/mediaItem/PrismaMediaItemRepository';

@Module({
  controllers: [MediaDetailsController],
  providers: [
    MediaDetailsService,
    {
      provide: MediaDetailsRepositorySymbol,
      useClass: PrismaMediaDetailsRepository,
    },
    { provide: MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository },
  ],
  exports: [MediaDetailsService],
})
export class MediaDetailsModule {}
