import { Module } from '@nestjs/common';
import { MigrateController } from '@/routes/migrate/migrate.controller';
import { UserRepositorySymbol } from '@/repositories/user/UserRepositoryInterface';
import { PrismaUserRepository } from '@/repositories/user/PrismaUserRepository';
import { AccountRepositorySymbol } from '@/repositories/account/AccountRepositoryInterface';
import { PrismaAccountRepository } from '@/repositories/account/PrismaAccountRepository';
import { MediaListRepositorySymbol } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { PrismaMediaListRepository } from '@/repositories/mediaList/PrismaMediaListRepository';
import { MediaItemRepositorySymbol } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { PrismaMediaItemRepository } from '@/repositories/mediaItem/PrismaMediaItemRepository';

@Module({
  imports: [],
  controllers: [MigrateController],
  providers: [
    {
      provide: UserRepositorySymbol,
      useClass: PrismaUserRepository,
    },
    {
      provide: AccountRepositorySymbol,
      useClass: PrismaAccountRepository,
    },
    {
      provide: MediaListRepositorySymbol,
      useClass: PrismaMediaListRepository,
    },
    { provide: MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository },
  ],
  exports: [],
})
export class MigrateModule {}
