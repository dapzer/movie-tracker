import { Module } from "@nestjs/common"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { DrizzleTvWatchCycleRepository } from "@/repositories/tvWatchCycle/DrizzleTvWatchCycleRepository"
import { TvWatchCycleRepositorySymbol } from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import { MediaDetailsServiceModule } from "@/services/mediaDetails/mediaDetails.module"
import { MediaItemsService } from "@/services/mediaItems/mediaItems.service"
import { MediaListsServiceModule } from "@/services/mediaLists/mediaLists.module"
import { TvWatchCyclesServiceModule } from "@/services/tvWatchCycles/tvWatchCycles.module"

@Module({
  imports: [MediaListsServiceModule, MediaDetailsServiceModule, TvWatchCyclesServiceModule],
  providers: [
    MediaItemsService,
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
    { provide: TvWatchCycleRepositorySymbol, useClass: DrizzleTvWatchCycleRepository },
  ],
  exports: [MediaItemsService],
})
export class MediaItemsServiceModule {}
