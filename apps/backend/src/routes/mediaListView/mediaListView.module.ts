import { MediaListViewRepositorySymbol } from "@/repositories/mediaListView/MediaListViewRepositoryInterface"
import { PrismaMediaListViewRepository } from "@/repositories/mediaListView/PrismaMediaListViewRepository"
import { Module } from "@nestjs/common"
import { MediaListViewController } from "./mediaListView.controller"
import { MediaListViewService } from "./mediaListView.service"

@Module({
  controllers: [MediaListViewController],
  providers: [MediaListViewService, { provide: MediaListViewRepositorySymbol, useClass: PrismaMediaListViewRepository }],
})
export class MediaListViewModule {}
