import { PrismaService } from '@/services/prisma/prisma.service';
import { MediaItemRepositoryInterface } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import {
  MediaDetails,
  MediaItem,
  Prisma,
  TrackingData,
} from '@movie-tracker/database';
import { Injectable } from '@nestjs/common';
import {
  MediaDetailsInfoType,
  MediaItemSiteToViewType,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemTvProgressType,
  MediaItemType,
  MediaTypeEnum,
} from '@movie-tracker/types';

@Injectable()
export class PrismaMediaItemRepository implements MediaItemRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private convertTrackingDataToInterface(
    data: TrackingData,
  ): MediaItemTrackingDataType {
    return {
      id: data.id,
      mediaItemId: data.mediaItemId,
      currentStatus: MediaItemStatusNameEnum[data.currentStatus],
      note: data.note,
      score: data.score,
      sitesToView: data.sitesToView as unknown as MediaItemSiteToViewType[],
      tvProgress: data.tvProgress as unknown as MediaItemTvProgressType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private convertToInterface = (
    data: MediaItem & {
      mediaDetails?: MediaDetails;
      trackingData: TrackingData;
    },
  ): MediaItemType => {
    const convertedTrackingData = this.convertTrackingDataToInterface(
      data.trackingData,
    );

    return {
      id: data.id,
      mediaDetailsId: data.mediaDetailsId,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase()],
      mediaListId: data.mediaListId,
      trackingData: convertedTrackingData,
      mediaDetails: data.mediaDetails
        ? {
            id: data.mediaDetails.id,
            mediaType: MediaTypeEnum[data.mediaDetails.mediaType.toUpperCase()],
            mediaId: data.mediaDetails.mediaId,
            score: data.mediaDetails.score.toNumber(),
            ru: data.mediaDetails.ru as unknown as MediaDetailsInfoType,
            en: data.mediaDetails.en as unknown as MediaDetailsInfoType,
            createdAt: data.mediaDetails.createdAt,
            updatedAt: data.mediaDetails.updatedAt,
          }
        : undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  };

  async getAllMediaItems() {
    const mediaItems = await this.prisma.mediaItem.findMany({
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    });

    return mediaItems.map(this.convertToInterface);
  }

  async getMediaItemById(id: string) {
    const mediaItem = await this.prisma.mediaItem.findUnique({
      where: { id },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    });

    return this.convertToInterface(mediaItem);
  }

  async getMediaItemsByUserId(userId: string) {
    const mediaItems = await this.prisma.mediaItem.findMany({
      where: {
        mediaList: {
          userId,
        },
      },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    });

    return mediaItems.map(this.convertToInterface);
  }

  async getMediaItemsByListId(mediaListId: string) {
    const mediaItems = await this.prisma.mediaItem.findMany({
      where: {
        mediaListId,
      },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    });

    return mediaItems.map(this.convertToInterface);
  }

  async createMediaItem(
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaListId: string,
    mediaDetailsId: string,
    createdAt?: Date,
  ) {
    const mediaItem = await this.prisma.mediaItem.create({
      data: {
        mediaListId,
        mediaId,
        mediaType,
        mediaDetailsId,
        ...(createdAt && { createdAt }),
        trackingData: {
          create: {
            score: null,
            sitesToView: [],
            tvProgress: {
              currentSeason: 0,
              currentEpisode: 1,
            },
            ...(createdAt && { createdAt }),
          },
        },
      },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    });

    return this.convertToInterface(mediaItem);
  }

  async createMediaItemWithExistedData(
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaListId: string,
    mediaDetailsId: string,
    trackingData: Omit<
      MediaItemTrackingDataType,
      'id' | 'updatedAt' | 'createdAt' | 'mediaItemId'
    >,
    createdAt?: Date,
  ) {
    const mediaItem = await this.prisma.mediaItem.create({
      data: {
        mediaListId,
        mediaId,
        mediaType,
        mediaDetailsId,
        ...(createdAt && { createdAt }),
        trackingData: {
          create: {
            score: trackingData.score,
            note: trackingData.note,
            sitesToView:
              trackingData.sitesToView as unknown as Prisma.JsonArray,
            tvProgress: trackingData.tvProgress as unknown as Prisma.JsonObject,
            ...(createdAt && { createdAt }),
          },
        },
      },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    });

    return this.convertToInterface(mediaItem);
  }

  async deleteMediaItem(id: string) {
    const mediaItem = await this.prisma.mediaItem.delete({
      where: {
        id,
      },
      include: {
        trackingData: true,
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
        trackingData: true,
      },
    });

    return this.convertToInterface(mediaItem);
  }

  async getMediaItemsCount() {
    return this.prisma.mediaItem.count();
  }
}
