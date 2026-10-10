import { Module } from "@nestjs/common"
import { TvWatchCyclesController } from "@/delivery/http/tvWatchCycles/tvWatchCycles.controller"
import { TvWatchCyclesServiceModule } from "@/services/tvWatchCycles/tvWatchCycles.module"

@Module({
  imports: [TvWatchCyclesServiceModule],
  controllers: [TvWatchCyclesController],
})
export class TvWatchCyclesModule {}
