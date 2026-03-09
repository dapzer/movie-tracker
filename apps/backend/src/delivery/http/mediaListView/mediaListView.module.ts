import { Module } from "@nestjs/common"
import { MediaListViewController } from "@/delivery/http/mediaListView/mediaListView.controller"
import { MediaListViewServiceModule } from "@/services/mediaListView/mediaListView.module"

@Module({
  imports: [MediaListViewServiceModule],
  controllers: [MediaListViewController],
})
export class MediaListViewHttpModule {}
