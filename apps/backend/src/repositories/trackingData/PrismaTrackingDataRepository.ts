import { TrackingDataRepositoryInterface } from '@/repositories/trackingData/TrackingDataRepositoryInterface';
import { PrismaService } from '@/services/prisma/prisma.service';
import { Prisma, TrackingData } from '@movie-tracker/database';
import {
  MediaItemSiteToViewType,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemTvProgressType,
} from '@movie-tracker/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTrackingDataRepository
  implements TrackingDataRepositoryInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  private convertToInterface(data: TrackingData): MediaItemTrackingDataType {
    return {
      id: data.id,
      mediaItemId: data.mediaItemId,
      note: data.note,
      score: data.score,
      currentStatus: MediaItemStatusNameEnum[data.currentStatus.toUpperCase()],
      sitesToView: data.sitesToView as unknown as MediaItemSiteToViewType[],
      tvProgress: data.tvProgress as unknown as MediaItemTvProgressType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getTrackingDataById(id: string) {
    const trackingData =
      await this.prismaService.trackingData.findUniqueOrThrow({
        where: {
          id,
        },
      });

    return this.convertToInterface(trackingData);
  }

  async updateTrackingData(
    id: string,
    data: Partial<
      Omit<
        MediaItemTrackingDataType,
        'id' | 'createdAt' | 'updatedAt' | 'mediaItemId'
      >
    >,
  ) {
    const trackingData = await this.prismaService.trackingData.update({
      where: {
        id,
      },
      data: {
        note: data.note,
        score: data.score,
        currentStatus: data.currentStatus,
        sitesToView: data.sitesToView as unknown as Prisma.JsonArray,
        tvProgress: data.tvProgress as unknown as Prisma.JsonObject,
      },
    });

    return this.convertToInterface(trackingData);
  }
}
