import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from '@/repositories/mediaList/MediaListRepositoryInterface';
import { MediaDetailsService } from '@/routes/mediaDetails/mediaDetails.service';
import {
  MediaItemTrackingDataType,
  MediaItemType,
  MediaTypeEnum,
} from '@movie-tracker/types';

@Injectable()
export class MediaItemService {
  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {}

  private async isMediaItemOwner(
    id: string,
    userId: string,
    mediaItemBase?: MediaItemType,
  ) {
    const mediaItem =
      mediaItemBase ?? (await this.mediaItemRepository.getMediaItemById(id));
    const mediaList = await this.mediaListRepository.getMedialListById(
      mediaItem.mediaListId,
    );

    if (!mediaItem || !mediaList) {
      throw new HttpException(
        `Media item with id '${id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return mediaList.userId === userId;
  }

  async createMediaItem(
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaListId: string,
    userId: string,
  ) {
    const mediaList =
      await this.mediaListRepository.getMedialListById(mediaListId);

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${mediaListId}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (mediaList.userId !== userId) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }

    const mediaDetails =
      await this.mediaDetailsService.createOrUpdateMediaDetails(
        mediaId,
        mediaType,
        null,
      );

    return this.mediaItemRepository.createMediaItem(
      mediaId,
      mediaType,
      mediaListId,
      mediaDetails.id,
    );
  }

  async getMediaItemsByListId(mediaListId: string, userId: string) {
    const mediaList =
      await this.mediaListRepository.getMedialListById(mediaListId);

    if (mediaList && mediaList.userId !== userId && !mediaList.isPublic) {
      throw new HttpException(`Unauthorized.`, HttpStatus.UNAUTHORIZED);
    }

    return this.mediaItemRepository.getMediaItemsByListId(mediaListId);
  }

  async deleteMediaItem(id: string, userId: string) {
    const isMediaItemOwner = await this.isMediaItemOwner(id, userId);

    if (!isMediaItemOwner) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }

    return this.mediaItemRepository.deleteMediaItem(id);
  }

  async updateMediaItemTrackingData(
    id: string,
    trackingData: MediaItemTrackingDataType,
    userId: string,
  ) {
    const isMediaItemOwner = await this.isMediaItemOwner(id, userId);

    if (!isMediaItemOwner) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }

    return this.mediaItemRepository.updateMediaItemTrackingData(
      id,
      trackingData,
    );
  }
}
