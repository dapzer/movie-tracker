import { MediaDetailsRepositoryInterface } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"
import { MediaDetails, Prisma } from "@movie-tracker/database"
import {
  MediaDetailsInfoType,
  MediaDetailsType,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaMediaDetailsRepository
implements MediaDetailsRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  private convertToInterface(data: MediaDetails): MediaDetailsType {
    return {
      id: data.id,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType],
      score: data.score.toNumber(),
      en: data.en as unknown as MediaDetailsInfoType,
      ru: data.ru as unknown as MediaDetailsInfoType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
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

  async getMediaDetailsCount() {
    return this.prismaService.mediaDetails.count()
  }
}
