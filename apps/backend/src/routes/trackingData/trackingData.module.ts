import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { PrismaMediaListRepository } from "@/repositories/mediaList/PrismaMediaListRepository"
import { PrismaTrackingDataRepository } from "@/repositories/trackingData/PrismaTrackingDataRepository"
import { TrackingDataRepositorySymbol } from "@/repositories/trackingData/TrackingDataRepositoryInterface"
import { TrackingDataController } from "@/routes/trackingData/trackingData.controller"
import { TrackingDataService } from "@/routes/trackingData/trackingData.service"
import { Module } from "@nestjs/common"

@Module({
  controllers: [TrackingDataController],
  providers: [
    TrackingDataService,
    {
      provide: TrackingDataRepositorySymbol,
      useClass: PrismaTrackingDataRepository,
    },
    { provide: MediaListRepositorySymbol, useClass: PrismaMediaListRepository },
  ],
})
export class TrackingDataModule {}
