import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { PrismaMediaItemRepository } from "@/repositories/mediaItem/PrismaMediaItemRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { PrismaMediaListRepository } from "@/repositories/mediaList/PrismaMediaListRepository"
import { MediaDetailsModule } from "@/routes/mediaDetails/mediaDetails.module"
import { MediaItemController } from "@/routes/mediaItem/mediaItem.controller"
import { MediaItemService } from "@/routes/mediaItem/mediaItem.service"
import { MediaListModule } from "@/routes/mediaList/mediaList.module"
import { Module } from "@nestjs/common"

@Module({
  controllers: [MediaItemController],
  providers: [
    MediaItemService,
    { provide: MediaListRepositorySymbol, useClass: PrismaMediaListRepository },
    { provide: MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository },
  ],
  imports: [MediaListModule, MediaDetailsModule],
})
export class MediaItemModule {}
