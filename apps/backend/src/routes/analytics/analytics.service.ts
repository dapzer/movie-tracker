import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryInterface,
  UserRepositorySymbol,
} from '@/repositories/user/UserRepositoryInterface';
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from '@/repositories/mediaList/MediaListRepositoryInterface';
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import {
  MediaDetailsRepositoryInterface,
  MediaDetailsRepositorySymbol,
} from '@/repositories/mediaDetails/MediaDetailsRepositoryInterface';
import { AnalyticsRecords } from '@movie-tracker/types';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(MediaDetailsRepositorySymbol)
    private readonly mediaDetailsRepository: MediaDetailsRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
  ) {}

  async getRecords(): Promise<AnalyticsRecords> {
    const [mediaDetails, mediaItems, users, mediaLists] = await Promise.all([
      this.mediaDetailsRepository.getMediaDetailsCount(),
      this.mediaItemRepository.getMediaItemsCount(),
      this.userRepository.getUsersCount(),
      this.mediaListRepository.getMediaListsCount(),
    ]);

    return {
      mediaDetails,
      mediaItems,
      users,
      mediaLists,
    };
  }
}
