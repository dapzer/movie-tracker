import { Module } from '@nestjs/common';
import { MediaListController } from '@/routes/mediaList/mediaList.controller';
import { MediaListService } from '@/routes/mediaList/mediaList.service';
import { MediaListRepositorySymbol } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { PrismaMediaListRepository } from '@/repositories/mediaList/PrismaMediaListRepository';

@Module({
  imports: [],
  controllers: [MediaListController],
  providers: [
    MediaListService,
    { provide: MediaListRepositorySymbol, useClass: PrismaMediaListRepository },
  ],
  exports: [MediaListService],
})
export class MediaListModule {}
