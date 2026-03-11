import { Module } from "@nestjs/common"
import { DrizzleMediaListViewRepository } from "@/repositories/mediaListView/DrizzleMediaListViewRepository"
import { MediaListViewRepositorySymbol } from "@/repositories/mediaListView/MediaListViewRepositoryInterface"
import { MediaListViewsService } from "@/services/mediaListViews/mediaListViews.service"

@Module({
  providers: [
    MediaListViewsService,
    { provide: MediaListViewRepositorySymbol, useClass: DrizzleMediaListViewRepository },
  ],
  exports: [MediaListViewsService],
})
export class MediaListViewsServiceModule {}
