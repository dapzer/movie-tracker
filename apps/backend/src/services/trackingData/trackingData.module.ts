import { Module } from "@nestjs/common"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleTrackingDataRepository } from "@/repositories/trackingData/DrizzleTrackingDataRepository"
import { TrackingDataRepositorySymbol } from "@/repositories/trackingData/TrackingDataRepositoryInterface"
import { TrackingDataService } from "@/services/trackingData/trackingData.service"

@Module({
  providers: [
    TrackingDataService,
    { provide: TrackingDataRepositorySymbol, useClass: DrizzleTrackingDataRepository },
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
  ],
  exports: [TrackingDataService],
})
export class TrackingDataServiceModule {}
