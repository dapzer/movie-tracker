import { Module } from "@nestjs/common"
import { DrizzleMediaDetailsRepository } from "@/repositories/mediaDetails/DrizzleMediaDetailsRepository"
import { MediaDetailsRepositorySymbol } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { MediaDetailsModule } from "@/routes/mediaDetails/mediaDetails.module"
import { MediaRatingController } from "@/routes/mediaRating/mediaRating.controller"
import { MediaRatingService } from "@/routes/mediaRating/mediaRating.service"

@Module({
  imports: [MediaDetailsModule],
  controllers: [MediaRatingController],
  providers: [
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
    {
      provide: MediaDetailsRepositorySymbol,
      useClass: DrizzleMediaDetailsRepository,
    },
    {
      provide: UserRepositorySymbol,
      useClass: DrizzleUserRepository,
    },
    MediaRatingService,
  ],
  exports: [],
})
export class MediaRatingModule {}
