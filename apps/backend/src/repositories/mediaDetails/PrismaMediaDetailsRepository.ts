import { Injectable } from '@nestjs/common';
import { MediaDetailsRepositoryInterface } from '@/repositories/mediaDetails/MediaDetailsRepositoryInterface';
import { PrismaService } from '@/services/prisma/prisma.service';
import {
  MediaDetailsInfoType,
  MediaDetailsType,
  MediaTypeEnum,
} from '@movie-tracker/types';
import { MediaDetails } from '@movie-tracker/database';

@Injectable()
export class PrismaMediaDetailsRepository
  implements MediaDetailsRepositoryInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  private convertToInterface(data: MediaDetails): MediaDetailsType {
    return {
      id: data.id,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType],
      score: data.score,
      en: data.en,
      ru: data.ru,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
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
        ru: mediaDetailsInfoRu,
        en: mediaDetailsInfoEn,
        score,
      },
    });

    return this.convertToInterface(mediaDetails);
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
        ru: mediaDetailsInfoRu,
        en: mediaDetailsInfoEn,
        score,
      },
    });

    return this.convertToInterface(mediaDetails);
  }

  async getMediaDetailsItem(mediaId: number, mediaType: MediaTypeEnum) {
    const mediaDetails = await this.prismaService.mediaDetails.findUnique({
      where: {
        mediaId_mediaType: {
          mediaId,
          mediaType,
        },
      },
    });

    return mediaDetails ? this.convertToInterface(mediaDetails) : null;
  }
}
