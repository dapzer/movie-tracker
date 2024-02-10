import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  UserRepositoryInterface,
  UserRepositorySymbol,
} from '@/repositories/user/UserRepositoryInterface';
import {
  AccountRepositoryInterface,
  AccountRepositorySymbol,
} from '@/repositories/account/AccountRepositoryInterface';
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from '@/repositories/mediaList/MediaListRepositoryInterface';
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { accounts } from './data/account';
import { users } from './data/user';
import { PrismaService } from '@/services/prisma/prisma.service';
import {
  MediaItemStatusNameEnum,
  MediaTypeEnum,
  UserRoleEnum,
} from '@movie-tracker/types';
import { AuthGuard } from '@/routes/auth/guards/auth.guard';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '@/guards/roles.guard';

@Controller('migrate')
export class MigrateController {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly usersRepository: UserRepositoryInterface,
    @Inject(AccountRepositorySymbol)
    private readonly accountRepository: AccountRepositoryInterface,
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  private getStatus(status: string) {
    switch (status) {
      case 'viewed':
        return MediaItemStatusNameEnum.VIEWED;
      case 'notViewed':
        return MediaItemStatusNameEnum.NOT_VIEWED;
      case 'waitNewPart':
        return MediaItemStatusNameEnum.WAIT_NEW_PART;
      case 'watchingNow':
        return MediaItemStatusNameEnum.WATCHING_NOW;
    }
  }

  @Get('')
  async migrate() {
    let count = 0;
    let duplicates = 0;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const account = accounts.find(
        (account) => account.userId.$oid === user._id.$oid,
      );
      const newUser = await this.usersRepository.createUser({
        name: user.name,
        email: user.email,
        image: user.image,
      });
      await this.accountRepository.createAccount({
        userId: newUser.id,
        type: 'oauth',
        provider: account!.provider,
        providerAccountId: account!.providerAccountId,
        refresh_token: undefined,
        access_token: account!.access_token,
        expires_at: account!.expires_at,
      });

      const mediaList = await this.mediaListRepository.createMediaList(
        newUser.id,
        true,
      );

      if (!user.favoriteList || !user.favoriteList.length) continue;

      for (const mediaItem of user.favoriteList) {
        try {
          await this.prisma.mediaItem.create({
            data: {
              mediaListId: mediaList.id,
              mediaId: mediaItem.id,
              mediaType:
                MediaTypeEnum[
                  mediaItem.mediaType.toUpperCase() as keyof typeof MediaTypeEnum
                ],
              createdAt: new Date(
                +mediaItem.addedDate.$numberLong,
              ).toISOString(),
              trackingData: {
                create: {
                  createdAt: new Date(
                    +mediaItem.addedDate.$numberLong,
                  ).toISOString(),
                  currentStatus: this.getStatus(
                    mediaItem.trackingData.currentStatus,
                  ),
                  note: mediaItem.trackingData.note,
                  score: null,
                  sitesToView: mediaItem.trackingData.sitesToView,
                  tvProgress: {
                    currentSeason:
                      mediaItem.trackingData.seriesInfo.currentSeason,
                    currentEpisode:
                      mediaItem.trackingData.seriesInfo.currentEpisode,
                  },
                },
              },
            },
          });
        } catch (e) {
          duplicates += 1;
        }

        count += 1;
      }
    }

    return {
      count,
      dublicates: duplicates,
    };
  }
}
