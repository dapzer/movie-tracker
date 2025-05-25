import { MediaRatingRepositoryInterface } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"
import { MediaRating } from "@movie-tracker/database"
import { MediaRatingType, MediaTypeEnum } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaMediaRatingRepository implements MediaRatingRepositoryInterface {
  private convertMediaRatingToInterface(data: MediaRating): MediaRatingType {
    return {
      id: data.id,
      userId: data.userId,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase()],
      rating: data.rating,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  constructor(private readonly prisma: PrismaService) {
  }

  async getMediaRatingId(args: Parameters<MediaRatingRepositoryInterface["getMediaRatingId"]>[0]) {
    const { id } = args
    const mediaRating = await this.prisma.mediaRating.findUnique({
      where: { id },
    })

    return mediaRating ? this.convertMediaRatingToInterface(mediaRating) : undefined
  }

  async getMediaRatingByUserId(args: Parameters<MediaRatingRepositoryInterface["getMediaRatingByUserId"]>[0]) {
    const { userId, mediaId, mediaType } = args
    const mediaRating = await this.prisma.mediaRating.findFirst({
      where: {
        userId,
        mediaId,
        mediaType,
      },
    })

    return mediaRating ? this.convertMediaRatingToInterface(mediaRating) : undefined
  }

  async getMediaRatingsByUserIdAndMediaId(args: Parameters<MediaRatingRepositoryInterface["getMediaRatingsByUserIdAndMediaId"]>[0]) {
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

  async createMediaRating(args: Parameters<MediaRatingRepositoryInterface["createMediaRating"]>[0]) {
    const { userId, mediaId, mediaType, rating } = args
    const mediaRating = await this.prisma.mediaRating.create({
      data: {
        userId,
        mediaId,
        mediaType,
        rating,
      },
    })

    return this.convertMediaRatingToInterface(mediaRating)
  }

  async updateMediaRating(args: Parameters<MediaRatingRepositoryInterface["updateMediaRating"]>[0]) {
    const { id, rating } = args
    const mediaRating = await this.prisma.mediaRating.update({
      where: { id },
      data: {
        rating,
      },
    })

    return this.convertMediaRatingToInterface(mediaRating)
  }

  async deleteMediaRating(id: string) {
    const mediaRating = await this.prisma.mediaRating.delete({
      where: { id },
    })

    return this.convertMediaRatingToInterface(mediaRating)
  }

  async getMediaRatingsCount() {
    return this.prisma.mediaRating.count()
  }
}
