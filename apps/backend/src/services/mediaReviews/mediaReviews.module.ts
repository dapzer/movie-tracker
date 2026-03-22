import { Module } from "@nestjs/common"
import { DrizzleMediaReviewRepository } from "@/repositories/mediaReview/DrizzleMediaReviewRepository"
import { MediaReviewRepositorySymbol } from "@/repositories/mediaReview/MediaReviewRepositoryInterface"
import { DrizzleMediaReviewDislikeRepository } from "@/repositories/mediaReviewDislike/DrizzleMediaReviewDislikeRepository"
import { MediaReviewDislikeRepositorySymbol } from "@/repositories/mediaReviewDislike/MediaReviewDislikeRepositoryInterface"
import { DrizzleMediaReviewLikeRepository } from "@/repositories/mediaReviewLike/DrizzleMediaReviewLikeRepository"
import { MediaReviewLikeRepositorySymbol } from "@/repositories/mediaReviewLike/MediaReviewLikeRepositoryInterface"
import { MediaDetailsServiceModule } from "@/services/mediaDetails/mediaDetails.module"
import { MediaReviewsService } from "@/services/mediaReviews/mediaReviews.service"

@Module({
  imports: [MediaDetailsServiceModule],
  providers: [
    MediaReviewsService,
    { provide: MediaReviewRepositorySymbol, useClass: DrizzleMediaReviewRepository },
    { provide: MediaReviewLikeRepositorySymbol, useClass: DrizzleMediaReviewLikeRepository },
    { provide: MediaReviewDislikeRepositorySymbol, useClass: DrizzleMediaReviewDislikeRepository },
  ],
  exports: [MediaReviewsService],
})
export class MediaReviewsServiceModule {}
