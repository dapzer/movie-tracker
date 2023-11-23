import { PrismaService } from '@/services/prisma/prisma.service';
import { MediaItemRepositoryInterface } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { MediaDetails, MediaItem } from '@movie-tracker/database';
import { Injectable } from '@nestjs/common';
import {
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemType,
  MediaTypeEnum,
} from '@movie-tracker/types';

@Injectable()
export class PrismaMediaItemRepository implements MediaItemRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private convertToInterface(
    data: MediaItem & { mediaDetails?: MediaDetails },
  ): MediaItemType {
    return {
      id: data.id,
      mediaDetailsId: data.mediaDetailsId,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType],
      mediaListId: data.mediaListId,
      trackingData: {
        currentStatus: MediaItemStatusNameEnum[data.trackingData.currentStatus],
        note: data.trackingData.note,
        score: data.trackingData.score,
        seriesInfo: data.trackingData.seriesInfo,
        sitesToView: data.trackingData.sitesToView,
      },
      mediaDetails: data.mediaDetails
        ? {
            id: data.mediaDetails.id,
            mediaType: MediaTypeEnum[data.mediaDetails.mediaType],
            mediaId: data.mediaDetails.mediaId,
            score: data.mediaDetails.score,
            ru: data.mediaDetails.ru,
            en: data.mediaDetails.en,
            createdAt: data.mediaDetails.createdAt,
            updatedAt: data.mediaDetails.updatedAt,
          }
        : undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getAllMediaItems() {
    const mediaItems = await this.prisma.mediaItem.findMany();

    return mediaItems.map(this.convertToInterface);
  }

  async getMediaItemById(id: string) {
    const mediaItem = await this.prisma.mediaItem.findUnique({
      where: { id },
    });

    return this.convertToInterface(mediaItem);
  }

  async getMediaItemsByListId(mediaListId: string) {
    const mediaItems = await this.prisma.mediaItem.findMany({
      where: {
        mediaListId,
      },
      include: {
        mediaDetails: true,
      },
    });

    return mediaItems.map(this.convertToInterface);
  }

  async createMediaItem(
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaListId: string,
    mediaDetailsId: string,
  ) {
    const mediaItem = await this.prisma.mediaItem.create({
      data: {
        mediaListId,
        mediaId,
        mediaType,
        mediaDetailsId,
        trackingData: {
          currentStatus: MediaItemStatusNameEnum.NOT_VIEWED,
          note: '',
          sitesToView: [],
          score: null,
          seriesInfo: {
            currentSeason: 0,
            currentEpisode: 1,
          },
        },
      },
      include: {
        mediaDetails: true,
      },
    });

    return this.convertToInterface(mediaItem);
  }

  async deleteMediaItem(id: string) {
    const mediaItem = await this.prisma.mediaItem.delete({
      where: {
        id,
      },
    });

    return this.convertToInterface(mediaItem);
  }

  async updateMediaItemTrackingData(
    id: string,
    trackingData: MediaItemTrackingDataType,
  ) {
    const mediaItem = await this.prisma.mediaItem.update({
      where: { id },
      data: {
        trackingData,
      },
      include: {
        mediaDetails: true,
      },
    });

    return this.convertToInterface(mediaItem);
  }

  async updateMediaItem(
    id: string,
    data: Partial<Pick<MediaItemType, 'mediaDetailsId' | 'mediaListId'>>,
  ) {
    const mediaItem = await this.prisma.mediaItem.update({
      where: { id },
      data,
      include: {
        mediaDetails: true,
      },
    });

    return this.convertToInterface(mediaItem);
  }
}
