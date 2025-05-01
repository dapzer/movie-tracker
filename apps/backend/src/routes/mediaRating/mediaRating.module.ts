import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { PrismaMediaRatingRepository } from "@/repositories/mediaRating/PrismaMediaRatingRepository"
import { MediaRatingController } from "@/routes/mediaRating/mediaRating.controller"
import { MediaRatingService } from "@/routes/mediaRating/mediaRating.service"
import { Module } from "@nestjs/common"

@Module({
  imports: [],
  controllers: [MediaRatingController],
  providers: [
    { provide: MediaRatingRepositorySymbol, useClass: PrismaMediaRatingRepository },
    MediaRatingService,
  ],
  exports: [],
})
export class MediaRatingModule {}
