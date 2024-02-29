import { Module } from '@nestjs/common';
import { TrackingDataController } from '@/routes/trackingData/trackingData.controller';
import { TrackingDataService } from '@/routes/trackingData/trackingData.service';
import { TrackingDataRepositorySymbol } from '@/repositories/trackingData/TrackingDataRepositoryInterface';
import { PrismaTrackingDataRepository } from '@/repositories/trackingData/PrismaTrackingDataRepository';
import { MediaListRepositorySymbol } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { PrismaMediaListRepository } from '@/repositories/mediaList/PrismaMediaListRepository';

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
