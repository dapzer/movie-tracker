import { Module } from "@nestjs/common"
import { MediaListController } from "@/delivery/http/mediaList/mediaList.controller"
import { MediaListServiceModule } from "@/services/mediaList/mediaList.module"

@Module({
  imports: [MediaListServiceModule],
  controllers: [MediaListController],
})
export class MediaListHttpModule {}
