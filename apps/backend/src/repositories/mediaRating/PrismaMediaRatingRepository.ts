import { MediaDetails, MediaRating } from "@movie-tracker/database"
import {
  MediaDetailsInfoType,
  MediaRatingType,
  MediaTypeEnum,
  UserMediaRatingsAccessLevelEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { MediaRatingRepositoryInterface } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaMediaRatingRepository implements MediaRatingRepositoryInterface {
  private convertMediaRatingToInterface(data: MediaRating & {
    mediaDetails?: MediaDetails
  }): MediaRatingType {
    const { seasons: _, ...enMediaDetails } = data.mediaDetails.en as unknown as MediaDetailsInfoType
    const { seasons: __, ...ruMediaDetails } = data.mediaDetails.ru as unknown as MediaDetailsInfoType

    return {
      id: data.id,
      userId: data.userId,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase()],
      mediaDetailsId: data.mediaDetailsId,
      mediaDetails: data.mediaDetails
        ? {
            id: data.mediaDetails.id,
            mediaType: MediaTypeEnum[data.mediaDetails.mediaType.toUpperCase()],
            mediaId: data.mediaDetails.mediaId,
            score: data.mediaDetails.score.toNumber(),
            ru: ruMediaDetails,
            en: enMediaDetails,
            createdAt: data.mediaDetails.createdAt,
            updatedAt: data.mediaDetails.updatedAt,
          }
        : undefined,
      rating: data.rating,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  constructor(private readonly prisma: PrismaService) {
  }

  async getAll() {
    const mediaRatings = await this.prisma.mediaRating.findMany()
    return mediaRatings.map(this.convertMediaRatingToInterface)
  }

  async getRecentlyCreated(args: Parameters<MediaRatingRepositoryInterface["getRecentlyCreated"]>[0]) {
    const [items, totalCount] = await Promise.all([
      this.prisma.mediaRating.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          user: {
            mediaRatingsAccessLevel: UserMediaRatingsAccessLevelEnum.PUBLIC,
          },
        },
        include: {
          mediaDetails: true,
        },
        take: args.limit,
        skip: args.offset,
      }),
      this.prisma.mediaRating.count(),
    ])

    return {
      items: items.map(this.convertMediaRatingToInterface),
      totalCount,
    }
  }

  async getById(args: Parameters<MediaRatingRepositoryInterface["getById"]>[0]) {
    const { id } = args
    const mediaRating = await this.prisma.mediaRating.findUnique({
      where: { id },
    })

    return mediaRating ? this.convertMediaRatingToInterface(mediaRating) : undefined
  }

  async getByUserId(args: Parameters<MediaRatingRepositoryInterface["getByUserId"]>[0]) {
    const { userId } = args
    const [items, totalCount] = await Promise.all([
      this.prisma.mediaRating.findMany({
        where: { userId },
        orderBy: {
          createdAt: "desc",
        },
        take: args.limit,
        skip: args.offset,
        include: {
          mediaDetails: true,
        },
      }),
      this.prisma.mediaRating.count({
        where: { userId },
      }),
    ])

    return {
      items: items.map(this.convertMediaRatingToInterface),
      totalCount,
    }
  }

  async getByUserIdAndMediaId(args: Parameters<MediaRatingRepositoryInterface["getByUserIdAndMediaId"]>[0]) {
    const { userId, mediaId } = args
    const mediaRating = await this.prisma.mediaRating.findFirst({
      where: {
        userId,
        mediaId,
      },
    })

    return mediaRating ? this.convertMediaRatingToInterface(mediaRating) : undefined
  }

  async getByUserIdAndMediaIds(args: Parameters<MediaRatingRepositoryInterface["getByUserIdAndMediaIds"]>[0]) {
    const { userId, mediaIds } = args
    const mediaRatings = await this.prisma.mediaRating.findMany({
      where: {
        userId,
        mediaId: {
          in: mediaIds,
        },
      },
    })

    return mediaRatings.map(this.convertMediaRatingToInterface)
  }

  async create(args: Parameters<MediaRatingRepositoryInterface["create"]>[0]) {
    const mediaRating = await this.prisma.mediaRating.create({
      data: {
        userId: args.userId,
        mediaDetailsId: args.mediaDetailsId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        rating: args.rating,
      },
    })

    return this.convertMediaRatingToInterface(mediaRating)
  }

  async update(args: Parameters<MediaRatingRepositoryInterface["update"]>[0]) {
    const { id, rating } = args
    const mediaRating = await this.prisma.mediaRating.update({
      where: { id },
      data: {
        rating,
      },
    })

    return this.convertMediaRatingToInterface(mediaRating)
  }

  async delete(id: string) {
    const mediaRating = await this.prisma.mediaRating.delete({
      where: { id },
    })

    return this.convertMediaRatingToInterface(mediaRating)
  }

  async getCount() {
    return this.prisma.mediaRating.count()
  }
}
