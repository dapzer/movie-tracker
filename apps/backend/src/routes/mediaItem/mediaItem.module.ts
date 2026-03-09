import { Module } from "@nestjs/common"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { MediaDetailsModule } from "@/routes/mediaDetails/mediaDetails.module"
import { MediaItemController } from "@/routes/mediaItem/mediaItem.controller"
import { MediaItemService } from "@/routes/mediaItem/mediaItem.service"
import { MediaListModule } from "@/routes/mediaList/mediaList.module"

@Module({
  controllers: [MediaItemController],
  providers: [
    MediaItemService,
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
  ],
  imports: [MediaListModule, MediaDetailsModule],
})
export class MediaItemModule {}
