import { Prisma, TrackingData } from "@movie-tracker/database"
import {
  MediaItemSiteToViewType,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemTvProgressType,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { TrackingDataRepositoryInterface } from "@/repositories/trackingData/TrackingDataRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaTrackingDataRepository
implements TrackingDataRepositoryInterface {
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
    }
  }

  async getById(id: string) {
    const trackingData
      = await this.prismaService.trackingData.findUniqueOrThrow({
        where: {
          id,
        },
      })

    return this.convertToInterface(trackingData)
  }

  async update(
    args: Parameters<TrackingDataRepositoryInterface["update"]>[0],
  ) {
    const trackingData = await this.prismaService.trackingData.update({
      where: {
        id: args.id,
      },
      data: {
        note: args.data.note,
        score: args.data.score,
        currentStatus: args.data.currentStatus,
        sitesToView: args.data.sitesToView as unknown as Prisma.JsonArray,
        tvProgress: args.data.tvProgress as unknown as Prisma.JsonObject,
      },
    })

    return this.convertToInterface(trackingData)
  }
}
