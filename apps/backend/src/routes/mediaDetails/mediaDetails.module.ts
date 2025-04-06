import { MediaDetailsRepositorySymbol } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { PrismaMediaDetailsRepository } from "@/repositories/mediaDetails/PrismaMediaDetailsRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { PrismaMediaItemRepository } from "@/repositories/mediaItem/PrismaMediaItemRepository"
import { MediaDetailsController } from "@/routes/mediaDetails/mediaDetails.controller"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"
import { Module } from "@nestjs/common"

@Module({
  controllers: [MediaDetailsController],
  providers: [
    MediaDetailsService,
    {
      provide: MediaDetailsRepositorySymbol,
      useClass: PrismaMediaDetailsRepository,
    },
    { provide: MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository },
  ],
  exports: [MediaDetailsService],
})
export class MediaDetailsModule {}
