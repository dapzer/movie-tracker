import { MediaDetails, MediaItem, Prisma, TrackingData } from "@movie-tracker/database"
import {
  MediaDetailsInfoType,
  MediaItemsCountByStatusType,
  MediaItemSiteToViewType,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemTvProgressType,
  MediaItemType,
  MediaTypeEnum,
  SortOrderEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { MediaItemRepositoryInterface } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

function getSearchConditions(search?: string): Prisma.MediaItemWhereInput {
  return {
    ...(search
      ? {
          mediaDetails: {
            is: {
              OR: [
                {
                  en: {
                    path: ["title"],
                    string_contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  en: {
                    path: ["originalTitle"],
                    string_contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  ru: {
                    path: ["title"],
                    string_contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        }
      : {}),
  }
}

@Injectable()
export class PrismaMediaItemRepository implements MediaItemRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {
  }

  private convertTrackingDataToInterface(
    data: TrackingData,
  ): MediaItemTrackingDataType {
    if (!data) {
      return null
    }

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
      trackingData?: TrackingData
    },
  ): MediaItemType => {
    return {
      id: data.id,
      mediaDetailsId: data.mediaDetailsId,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase()],
      mediaListId: data.mediaListId,
      trackingData: data.trackingData
        ? this.convertTrackingDataToInterface(
            data.trackingData,
          )
        : null,
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

  async getByIds(ids: string[]) {
    const mediaItems = await this.prisma.mediaItem.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        mediaDetails: true,
        trackingData: true,
      },
    })

    return mediaItems.map(this.convertToInterface)
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

  async getByListId(args: Parameters<MediaItemRepositoryInterface["getByListId"]>[0]) {
    const search = args.search?.trim()
    const sortBy = args.sortBy ?? "createdAt"
    const sortDirection = args.sortDirection ?? SortOrderEnum.DESC
    const where: Prisma.MediaItemWhereInput = {
      mediaListId: args.mediaListId,
      ...getSearchConditions(search),
      ...(args.mediaType
        ? {
            mediaType: args.mediaType,
          }
        : {}),
      ...(args.status
        ? {
            trackingData: {
              is: {
                currentStatus: args.status,
              },
            },
          }
        : {}),
    }

    const [items, totalCount] = await Promise.all([
      this.prisma.mediaItem.findMany({
        where,
        include: {
          mediaDetails: true,
          trackingData: true,
        },
        orderBy: {
          trackingData: {
            [sortBy]: sortDirection,
          },
        },
        ...(typeof args.limit === "number" ? { take: args.limit } : {}),
        ...(typeof args.offset === "number" ? { skip: args.offset } : {}),
      }),
      this.prisma.mediaItem.count({
        where,
      }),
    ])

    return {
      items: items.map(this.convertToInterface),
      totalCount,
    }
  }

  async getByMediaId(args: Parameters<MediaItemRepositoryInterface["getByMediaId"]>[0]) {
    const mediaItems = await this.prisma.mediaItem.findMany({
      where: {
        mediaId: args.mediaId,
        mediaList: {
          userId: args.userId,
        },
      },
      include: {
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

  async createMany(
    args: Parameters<MediaItemRepositoryInterface["createMany"]>[0],
  ) {
    if (args.length === 0) {
      return []
    }

    const mediaItems = await this.prisma.$transaction(
      args.map(item => this.prisma.mediaItem.create({
        data: {
          mediaListId: item.mediaListId,
          mediaId: item.mediaId,
          mediaType: item.mediaType,
          mediaDetailsId: item.mediaDetailsId,
          ...(item.createdAt && { createdAt: item.createdAt }),
          trackingData: {
            create: {
              score: null,
              sitesToView: [],
              tvProgress: {
                currentSeason: 0,
                currentEpisode: 1,
              },
              ...(item.createdAt && { createdAt: item.createdAt }),
              ...(item.currentStatus && { currentStatus: item.currentStatus }),
            },
          },
        },
        include: {
          mediaDetails: true,
          trackingData: true,
        },
      })),
    )

    return mediaItems.map(this.convertToInterface)
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

  async updateMany(
    args: Parameters<MediaItemRepositoryInterface["updateMany"]>[0],
  ) {
    if (args.length === 0) {
      return []
    }

    const mediaItems = await this.prisma.$transaction(
      args.map(item => this.prisma.mediaItem.update({
        where: { id: item.id },
        data: item.data,
        include: {
          mediaDetails: true,
          trackingData: true,
        },
      })),
    )

    return mediaItems.map(this.convertToInterface)
  }

  async deleteMany(ids: string[]) {
    if (ids.length === 0) {
      return []
    }

    const mediaItems = await this.prisma.$transaction(
      ids.map(id => this.prisma.mediaItem.delete({
        where: { id },
        include: {
          mediaDetails: true,
          trackingData: true,
        },
      })),
    )

    return mediaItems.map(this.convertToInterface)
  }

  async getAllCount() {
    return this.prisma.mediaItem.count()
  }

  async getCountByListId(args: Parameters<MediaItemRepositoryInterface["getCountByListId"]>[0]) {
    const initialStatusCounts: MediaItemsCountByStatusType = {
      [MediaItemStatusNameEnum.WATCHING_NOW]: 0,
      [MediaItemStatusNameEnum.NOT_VIEWED]: 0,
      [MediaItemStatusNameEnum.WAIT_NEW_PART]: 0,
      [MediaItemStatusNameEnum.VIEWED]: 0,
      total: 0,
    }
    const search = args.search?.trim()

    const mediaItems = await this.prisma.mediaItem.findMany({
      where: { mediaListId: args.mediaListId, ...getSearchConditions(search) },
      select: { id: true },
    })

    const mediaItemIds = mediaItems.map(item => item.id)

    if (mediaItemIds.length === 0) {
      return initialStatusCounts
    }

    const count = await this.prisma.trackingData.groupBy({
      by: ["currentStatus"],
      where: {
        mediaItemId: {
          in: mediaItemIds,
        },
      },
      _count: {
        currentStatus: true,
      },
    })

    return count.reduce((acc, item) => {
      const status = item.currentStatus as MediaItemStatusNameEnum
      acc[status] = item._count.currentStatus
      acc.total += item._count.currentStatus
      return acc
    }, {
      ...initialStatusCounts,
    } as MediaItemsCountByStatusType)
  }
}
