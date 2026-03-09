import { Module } from "@nestjs/common"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleTrackingDataRepository } from "@/repositories/trackingData/DrizzleTrackingDataRepository"
import { TrackingDataRepositorySymbol } from "@/repositories/trackingData/TrackingDataRepositoryInterface"
import { TrackingDataController } from "@/routes/trackingData/trackingData.controller"
import { TrackingDataService } from "@/routes/trackingData/trackingData.service"

@Module({
  controllers: [TrackingDataController],
  providers: [
    TrackingDataService,
    {
      provide: TrackingDataRepositorySymbol,
      useClass: DrizzleTrackingDataRepository,
    },
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
  ],
})
export class TrackingDataModule {}
