import { Module } from "@nestjs/common"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleTvEpisodeWatchRepository } from "@/repositories/tvEpisodeWatch/DrizzleTvEpisodeWatchRepository"
import { TvEpisodeWatchRepositorySymbol } from "@/repositories/tvEpisodeWatch/TvEpisodeWatchRepositoryInterface"
import { DrizzleTvWatchCycleRepository } from "@/repositories/tvWatchCycle/DrizzleTvWatchCycleRepository"
import { TvWatchCycleRepositorySymbol } from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import { TvEpisodeWatchesService } from "@/services/tvEpisodeWatches/tvEpisodeWatches.service"

@Module({
  providers: [
    TvEpisodeWatchesService,
    { provide: TvEpisodeWatchRepositorySymbol, useClass: DrizzleTvEpisodeWatchRepository },
    { provide: TvWatchCycleRepositorySymbol, useClass: DrizzleTvWatchCycleRepository },
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
  ],
  exports: [TvEpisodeWatchesService],
})
export class TvEpisodeWatchesServiceModule {}
