import { Module } from "@nestjs/common"
import { DrizzleMediaListViewRepository } from "@/repositories/mediaListView/DrizzleMediaListViewRepository"
import { MediaListViewRepositorySymbol } from "@/repositories/mediaListView/MediaListViewRepositoryInterface"
import { MediaListViewController } from "./mediaListView.controller"
import { MediaListViewService } from "./mediaListView.service"

@Module({
  controllers: [MediaListViewController],
  providers: [MediaListViewService, { provide: MediaListViewRepositorySymbol, useClass: DrizzleMediaListViewRepository }],
})
export class MediaListViewModule {}
