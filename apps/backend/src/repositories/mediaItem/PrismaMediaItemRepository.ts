import { PrismaService } from '@/services/prisma/prisma.service';
import { MediaItemRepositoryInterface } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { StatusNameEnum } from '@prisma/client';
import { MediaItemDto } from '@/routes/mediaItem/dto/mediaItem.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMediaItemRepository implements MediaItemRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMediaItems() {
    return this.prisma.mediaItem.findMany();
  }

  async getMediaItemById(id: string) {
    return this.prisma.mediaItem.findUnique({
      where: { id },
    });
  }

  async getMediaItemsByListId(mediaListId: string) {
    return this.prisma.mediaItem.findMany({
      where: {
        mediaListId,
      },
      include: {
        mediaDetails: true,
      },
    });
  }

  async createMediaItem(
    mediaId: number,
    mediaType: MediaItemDto['mediaType'],
    mediaListId: string,
    mediaDetailsId: string,
  ) {
    return this.prisma.mediaItem.create({
      data: {
        mediaListId,
        mediaId,
        mediaType,
        mediaDetailsId,
        trackingData: {
          currentStatus: StatusNameEnum.NOT_VIEWED,
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
  }

  async deleteMediaItem(id: string) {
    return this.prisma.mediaItem.delete({
      where: {
        id,
      },
    });
  }

  async updateMediaItemTrackingData(
    id: string,
    trackingData: MediaItemDto['trackingData'],
  ) {
    return this.prisma.mediaItem.update({
      where: { id },
      data: {
        trackingData,
      },
      include: {
        mediaDetails: true,
      },
    });
  }

  async updateMediaItem(
    id: string,
    data: Partial<Pick<MediaItemDto, 'mediaDetailsId' | 'mediaListId'>>,
  ) {
    return this.prisma.mediaItem.update({
      where: { id },
      data,
      include: {
        mediaDetails: true,
      },
    });
  }
}
