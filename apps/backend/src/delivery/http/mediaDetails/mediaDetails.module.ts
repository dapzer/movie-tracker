import { Module } from "@nestjs/common"
import { MediaDetailsController } from "@/delivery/http/mediaDetails/mediaDetails.controller"
import { MediaDetailsServiceModule } from "@/services/mediaDetails/mediaDetails.module"

@Module({
  imports: [MediaDetailsServiceModule],
  controllers: [MediaDetailsController],
})
export class MediaDetailsModule {}
