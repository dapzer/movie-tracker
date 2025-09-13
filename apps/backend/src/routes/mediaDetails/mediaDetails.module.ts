import { Module } from "@nestjs/common"
import { MediaDetailsRepositorySymbol } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { PrismaMediaDetailsRepository } from "@/repositories/mediaDetails/PrismaMediaDetailsRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { PrismaMediaItemRepository } from "@/repositories/mediaItem/PrismaMediaItemRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { PrismaMediaRatingRepository } from "@/repositories/mediaRating/PrismaMediaRatingRepository"
import { MediaDetailsController } from "@/routes/mediaDetails/mediaDetails.controller"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"

@Module({
  controllers: [MediaDetailsController],
  providers: [
    MediaDetailsService,
    {
      provide: MediaDetailsRepositorySymbol,
      useClass: PrismaMediaDetailsRepository,
    },
    { provide: MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository },
    { provide: MediaRatingRepositorySymbol, useClass: PrismaMediaRatingRepository },
  ],
  exports: [MediaDetailsService],
})
export class MediaDetailsModule {}
