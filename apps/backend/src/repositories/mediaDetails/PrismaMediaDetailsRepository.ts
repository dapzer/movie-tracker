import { MediaDetails, Prisma } from "@movie-tracker/database"
import { MediaDetailsInfoType, MediaDetailsType, MediaTypeEnum } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { MediaDetailsRepositoryInterface } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaMediaDetailsRepository
implements MediaDetailsRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  private convertToInterface(data: MediaDetails): MediaDetailsType {
    return {
      id: data.id,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase()],
      score: data.score.toNumber(),
      en: data.en as unknown as MediaDetailsInfoType,
      ru: data.ru as unknown as MediaDetailsInfoType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  async getMediaDetailsByMediaIds(args: Parameters<MediaDetailsRepositoryInterface["getMediaDetailsByMediaIds"]>[0]) {
    const { mediaIds } = args
    const mediaDetails = await this.prismaService.mediaDetails.findMany({
      where: {
        mediaId: {
          in: mediaIds,
        },
      },
    })

    return mediaDetails.map(this.convertToInterface)
  }

  async createMediaDetails(
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaDetailsInfoRu: MediaDetailsInfoType,
    mediaDetailsInfoEn: MediaDetailsInfoType,
    score: number,
  ) {
    const mediaDetails = await this.prismaService.mediaDetails.create({
      data: {
        mediaId,
        mediaType,
        ru: mediaDetailsInfoRu as unknown as Prisma.JsonArray,
        en: mediaDetailsInfoEn as unknown as Prisma.JsonArray,
        score,
      },
    })

    return this.convertToInterface(mediaDetails)
  }

  async updateMediaDetails(
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaDetailsInfoRu: MediaDetailsInfoType,
    mediaDetailsInfoEn: MediaDetailsInfoType,
    score: number,
  ) {
    const mediaDetails = await this.prismaService.mediaDetails.update({
      where: {
        mediaId_mediaType: {
          mediaId,
          mediaType,
        },
      },
      data: {
        ru: mediaDetailsInfoRu as unknown as Prisma.JsonArray,
        en: mediaDetailsInfoEn as unknown as Prisma.JsonArray,
        score,
      },
    })

    return this.convertToInterface(mediaDetails)
  }

  async getMediaDetailsItem(mediaId: number, mediaType: MediaTypeEnum) {
    const mediaDetails = await this.prismaService.mediaDetails.findUnique({
      where: {
        mediaId_mediaType: {
          mediaId,
          mediaType,
        },
      },
    })

    return mediaDetails ? this.convertToInterface(mediaDetails) : null
  }

  async getAllMediaDetails() {
    const mediaDetails = await this.prismaService.mediaDetails.findMany()

    return mediaDetails.map(this.convertToInterface)
  }

  async getMediaDetailsCount() {
    return this.prismaService.mediaDetails.count()
  }
}
