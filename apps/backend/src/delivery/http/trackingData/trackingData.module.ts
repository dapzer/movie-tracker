import { Module } from "@nestjs/common"
import { TrackingDataController } from "@/delivery/http/trackingData/trackingData.controller"
import { TrackingDataServiceModule } from "@/services/trackingData/trackingData.module"

@Module({
  imports: [TrackingDataServiceModule],
  controllers: [TrackingDataController],
})
export class TrackingDataModule {}
