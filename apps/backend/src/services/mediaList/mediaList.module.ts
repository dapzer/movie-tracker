import { Module } from "@nestjs/common"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { MediaListService } from "@/services/mediaList/mediaList.service"
import { NotificationServiceModule } from "@/services/notification/notification.module"

@Module({
  imports: [NotificationServiceModule],
  providers: [
    MediaListService,
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
  ],
  exports: [MediaListService],
})
export class MediaListServiceModule {}
