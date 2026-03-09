import { Module } from "@nestjs/common"
import { DrizzleMediaListViewRepository } from "@/repositories/mediaListView/DrizzleMediaListViewRepository"
import { MediaListViewRepositorySymbol } from "@/repositories/mediaListView/MediaListViewRepositoryInterface"
import { MediaListViewService } from "@/services/mediaListView/mediaListView.service"

@Module({
  providers: [
    MediaListViewService,
    { provide: MediaListViewRepositorySymbol, useClass: DrizzleMediaListViewRepository },
  ],
  exports: [MediaListViewService],
})
export class MediaListViewServiceModule {}
