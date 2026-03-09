import { Module } from "@nestjs/common"
import { DrizzleMediaDetailsRepository } from "@/repositories/mediaDetails/DrizzleMediaDetailsRepository"
import { MediaDetailsRepositorySymbol } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { MediaDetailsServiceModule } from "@/services/mediaDetails/mediaDetails.module"
import { MediaRatingService } from "@/services/mediaRating/mediaRating.service"

@Module({
  imports: [MediaDetailsServiceModule],
  providers: [
    MediaRatingService,
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
    { provide: MediaDetailsRepositorySymbol, useClass: DrizzleMediaDetailsRepository },
    { provide: UserRepositorySymbol, useClass: DrizzleUserRepository },
  ],
  exports: [MediaRatingService],
})
export class MediaRatingServiceModule {}
