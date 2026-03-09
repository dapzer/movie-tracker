import { Module } from "@nestjs/common"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListController } from "@/routes/mediaList/mediaList.controller"
import { MediaListService } from "@/routes/mediaList/mediaList.service"
import { NotificationModule } from "@/routes/notification/notification.module"

@Module({
  imports: [NotificationModule],
  controllers: [MediaListController],
  providers: [
    MediaListService,
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
  ],
  exports: [MediaListService],
})
export class MediaListModule {}
