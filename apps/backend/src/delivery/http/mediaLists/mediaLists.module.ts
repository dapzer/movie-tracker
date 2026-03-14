import { Module } from "@nestjs/common"
import { MediaListsController } from "@/delivery/http/mediaLists/mediaLists.controller"
import { MediaListsServiceModule } from "@/services/mediaLists/mediaLists.module"

@Module({
  imports: [MediaListsServiceModule],
  controllers: [MediaListsController],
})
export class MediaListsModule {}
