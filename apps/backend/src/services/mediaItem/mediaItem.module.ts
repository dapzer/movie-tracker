import { Module } from "@nestjs/common"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { MediaDetailsServiceModule } from "@/services/mediaDetails/mediaDetails.module"
import { MediaItemService } from "@/services/mediaItem/mediaItem.service"
import { MediaListServiceModule } from "@/services/mediaList/mediaList.module"

@Module({
  imports: [MediaListServiceModule, MediaDetailsServiceModule],
  providers: [
    MediaItemService,
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
  ],
  exports: [MediaItemService],
})
export class MediaItemServiceModule {}
