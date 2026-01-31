import { MediaDetails, MediaItem, Prisma, TrackingData } from "@movie-tracker/database"
import {
  MediaDetailsInfoType,
  MediaItemSiteToViewType,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemTvProgressType,
  MediaItemType,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { MediaItemRepositoryInterface } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

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
    }
  }

  private convertToInterface = (
    data: MediaItem & {
      mediaDetails?: MediaDetails
      trackingData: TrackingData
    },
  ): MediaItemType => {
    const convertedTrackingData = this.convertTrackingDataToInterface(
      data.trackingData,
    )

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
    }
  }

  async getAll() {
    const mediaItems = await this.prisma.mediaItem.findMany({
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    })

    return mediaItems.map(this.convertToInterface)
  }

  async getById(id: string) {
    const mediaItem = await this.prisma.mediaItem.findUnique({
      where: { id },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    })

    return this.convertToInterface(mediaItem)
  }

  async getByUserId(userId: string) {
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
    })

    return mediaItems.map(this.convertToInterface)
  }

  async getByListId(mediaListId: string) {
    const mediaItems = await this.prisma.mediaItem.findMany({
      where: {
        mediaListId,
      },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    })

    return mediaItems.map(this.convertToInterface)
  }

  async create(
    args: Parameters<MediaItemRepositoryInterface["create"]>[0],
  ) {
    const mediaItem = await this.prisma.mediaItem.create({
      data: {
        mediaListId: args.mediaListId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        mediaDetailsId: args.mediaDetailsId,
        ...(args.createdAt && { createdAt: args.createdAt }),
        trackingData: {
          create: {
            score: null,
            sitesToView: [],
            tvProgress: {
              currentSeason: 0,
              currentEpisode: 1,
            },
            ...(args.createdAt && { createdAt: args.createdAt }),
            ...(args.currentStatus && { currentStatus: args.currentStatus }),
          },
        },
      },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    })

    return this.convertToInterface(mediaItem)
  }

  async createWithExistedData(
    args: Parameters<MediaItemRepositoryInterface["createWithExistedData"]>[0],
  ) {
    const mediaItem = await this.prisma.mediaItem.create({
      data: {
        mediaListId: args.mediaListId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        mediaDetailsId: args.mediaDetailsId,
        ...(args.createdAt && { createdAt: args.createdAt }),
        trackingData: {
          create: {
            score: args.trackingData.score,
            note: args.trackingData.note,
            sitesToView:
              args.trackingData.sitesToView as unknown as Prisma.JsonArray,
            tvProgress: args.trackingData.tvProgress as unknown as Prisma.JsonObject,
            ...(args.createdAt && { createdAt: args.createdAt }),
          },
        },
      },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    })

    return this.convertToInterface(mediaItem)
  }

  async delete(id: string) {
    const mediaItem = await this.prisma.mediaItem.delete({
      where: {
        id,
      },
      include: {
        trackingData: true,
      },
    })

    return this.convertToInterface(mediaItem)
  }

  async update(
    args: Parameters<MediaItemRepositoryInterface["update"]>[0],
  ) {
    const mediaItem = await this.prisma.mediaItem.update({
      where: { id: args.id },
      data: args.data,
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    })

    return this.convertToInterface(mediaItem)
  }

  async getAllCount() {
    return this.prisma.mediaItem.count()
  }
}
