import { Module } from "@nestjs/common"
import { MediaDetailsRepositorySymbol } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { PrismaMediaDetailsRepository } from "@/repositories/mediaDetails/PrismaMediaDetailsRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { PrismaMediaRatingRepository } from "@/repositories/mediaRating/PrismaMediaRatingRepository"
import { MediaDetailsModule } from "@/routes/mediaDetails/mediaDetails.module"
import { MediaRatingController } from "@/routes/mediaRating/mediaRating.controller"
import { MediaRatingService } from "@/routes/mediaRating/mediaRating.service"

@Module({
  imports: [MediaDetailsModule],
  controllers: [MediaRatingController],
  providers: [
    { provide: MediaRatingRepositorySymbol, useClass: PrismaMediaRatingRepository },
    {
      provide: MediaDetailsRepositorySymbol,
      useClass: PrismaMediaDetailsRepository,
    },
    MediaRatingService,
  ],
  exports: [],
})
export class MediaRatingModule {}
