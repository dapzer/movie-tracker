import { Module } from "@nestjs/common"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { MediaListsService } from "@/services/mediaLists/mediaLists.service"
import { NotificationsServiceModule } from "@/services/notifications/notifications.module"

@Module({
  imports: [NotificationsServiceModule],
  providers: [
    MediaListsService,
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
  ],
  exports: [MediaListsService],
})
export class MediaListsServiceModule {}
