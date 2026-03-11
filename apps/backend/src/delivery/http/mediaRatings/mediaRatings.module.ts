import { Module } from "@nestjs/common"
import { MediaRatingsController } from "@/delivery/http/mediaRatings/mediaRatings.controller"
import { MediaRatingsServiceModule } from "@/services/mediaRatings/mediaRatings.module"

@Module({
  imports: [MediaRatingsServiceModule],
  controllers: [MediaRatingsController],
})
export class MediaRatingsHttpModule {}
