import { Module } from "@nestjs/common"
import { MediaListViewsController } from "@/delivery/http/mediaListViews/mediaListViews.controller"
import { MediaListViewsServiceModule } from "@/services/mediaListViews/mediaListViews.module"

@Module({
  imports: [MediaListViewsServiceModule],
  controllers: [MediaListViewsController],
})
export class MediaListViewsModule {}
