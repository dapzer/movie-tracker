import { Module } from "@nestjs/common"
import { TvEpisodeWatchesController } from "@/delivery/http/tvEpisodeWatches/tvEpisodeWatches.controller"
import { TvEpisodeWatchesServiceModule } from "@/services/tvEpisodeWatches/tvEpisodeWatches.module"

@Module({
  imports: [TvEpisodeWatchesServiceModule],
  controllers: [TvEpisodeWatchesController],
})
export class TvEpisodeWatchesModule {}
