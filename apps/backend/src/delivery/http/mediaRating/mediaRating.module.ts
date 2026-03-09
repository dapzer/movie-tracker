import { Module } from "@nestjs/common"
import { MediaRatingController } from "@/delivery/http/mediaRating/mediaRating.controller"
import { MediaRatingServiceModule } from "@/services/mediaRating/mediaRating.module"

@Module({
  imports: [MediaRatingServiceModule],
  controllers: [MediaRatingController],
})
export class MediaRatingHttpModule {}
