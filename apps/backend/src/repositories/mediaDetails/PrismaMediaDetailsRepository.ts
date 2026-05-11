// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import { MediaDetails, Prisma } from "@movie-tracker/database/prisma"
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
      releaseDate: data.releaseDate || undefined,
      genres: data.genres,
      status: data.status,
      en: data.en as unknown as MediaDetailsInfoType,
      ru: data.ru as unknown as MediaDetailsInfoType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  async getByMediaIds(args: Parameters<MediaDetailsRepositoryInterface["getByMediaIds"]>[0]) {
    const mediaDetails = await this.prismaService.mediaDetails.findMany({
      where: {
        mediaId: {
          in: args.mediaIds,
        },
      },
    })

    return mediaDetails.map(this.convertToInterface)
  }

  async create(args: Parameters<MediaDetailsRepositoryInterface["create"]>[0]) {
    const mediaDetails = await this.prismaService.mediaDetails.create({
      data: {
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        ru: args.ru as unknown as Prisma.JsonArray,
        en: args.en as unknown as Prisma.JsonArray,
        releaseDate: args.releaseDate,
        score: args.score,
        genres: args.genres,
        status: args.status,
      },
    })

    return this.convertToInterface(mediaDetails)
  }

  async update(args: Parameters<MediaDetailsRepositoryInterface["update"]>[0]) {
    const mediaDetails = await this.prismaService.mediaDetails.update({
      where: {
        mediaId_mediaType: {
          mediaId: args.mediaId,
          mediaType: args.mediaType,
        },
      },
      data: {
        ru: args.ru as unknown as Prisma.JsonArray,
        en: args.en as unknown as Prisma.JsonArray,
        releaseDate: args.releaseDate,
        score: args.score,
        genres: args.genres,
        status: args.status,
      },
    })

    return this.convertToInterface(mediaDetails)
  }

  async getByMediaData(args: Parameters<MediaDetailsRepositoryInterface["getByMediaData"]>[0]) {
    const mediaDetails = await this.prismaService.mediaDetails.findUnique({
      where: {
        mediaId_mediaType: {
          mediaId: args.mediaId,
          mediaType: args.mediaType,
        },
      },
    })

    return mediaDetails ? this.convertToInterface(mediaDetails) : null
  }

  async getAll() {
    const mediaDetails = await this.prismaService.mediaDetails.findMany()

    return mediaDetails.map(this.convertToInterface)
  }

  async getCount() {
    return this.prismaService.mediaDetails.count()
  }
}
