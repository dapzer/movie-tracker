import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { PrismaMediaItemRepository } from "@/repositories/mediaItem/PrismaMediaItemRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { PrismaMediaListRepository } from "@/repositories/mediaList/PrismaMediaListRepository"
import { MediaListController } from "@/routes/mediaList/mediaList.controller"
import { MediaListService } from "@/routes/mediaList/mediaList.service"
import { Module } from "@nestjs/common"

@Module({
  imports: [],
  controllers: [MediaListController],
  providers: [
    MediaListService,
    { provide: MediaListRepositorySymbol, useClass: PrismaMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository },
  ],
  exports: [MediaListService],
})
export class MediaListModule {}
