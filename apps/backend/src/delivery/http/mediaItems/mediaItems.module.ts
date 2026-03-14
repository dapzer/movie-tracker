import { Module } from "@nestjs/common"
import { MediaItemsController } from "@/delivery/http/mediaItems/mediaItems.controller"
import { MediaItemsServiceModule } from "@/services/mediaItems/mediaItems.module"

@Module({
  imports: [MediaItemsServiceModule],
  controllers: [MediaItemsController],
})
export class MediaItemsModule {}
