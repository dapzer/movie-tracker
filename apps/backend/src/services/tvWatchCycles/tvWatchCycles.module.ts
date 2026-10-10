import { Module } from "@nestjs/common"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleTvEpisodeWatchRepository } from "@/repositories/tvEpisodeWatch/DrizzleTvEpisodeWatchRepository"
import { TvEpisodeWatchRepositorySymbol } from "@/repositories/tvEpisodeWatch/TvEpisodeWatchRepositoryInterface"
import { DrizzleTvWatchCycleRepository } from "@/repositories/tvWatchCycle/DrizzleTvWatchCycleRepository"
import { TvWatchCycleRepositorySymbol } from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import { TvWatchCyclesService } from "@/services/tvWatchCycles/tvWatchCycles.service"

@Module({
  providers: [
    TvWatchCyclesService,
    { provide: TvWatchCycleRepositorySymbol, useClass: DrizzleTvWatchCycleRepository },
    { provide: TvEpisodeWatchRepositorySymbol, useClass: DrizzleTvEpisodeWatchRepository },
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
  ],
  exports: [TvWatchCyclesService],
})
export class TvWatchCyclesServiceModule {}
