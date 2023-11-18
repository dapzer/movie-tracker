import { Injectable } from '@nestjs/common';
import { MediaDetailsRepositoryInterface } from '@/repositories/mediaDetails/MediaDetailsRepositoryInterface';
import { MediaDetailsDto } from '@/routes/mediaDetails/dto/mediaDetails.dto';
import { MediaDetailsInfoDto } from '@/routes/mediaDetails/dto/mediaDetailsInfo.dto';
import { PrismaService } from '@/services/prisma/prisma.service';

@Injectable()
export class PrismaMediaDetailsRepository
  implements MediaDetailsRepositoryInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  async createMediaDetails(
    mediaId: number,
    mediaType: MediaDetailsDto['mediaType'],
    mediaDetailsInfoRu: MediaDetailsInfoDto,
    mediaDetailsInfoEn: MediaDetailsInfoDto,
    score: number,
  ) {
    return this.prismaService.mediaDetails.create({
      data: {
        mediaId,
        mediaType,
        ru: mediaDetailsInfoRu,
        en: mediaDetailsInfoEn,
        score,
      },
    });
  }

  async updateMediaDetails(
    mediaId: number,
    mediaType: MediaDetailsDto['mediaType'],
    mediaDetailsInfoRu: MediaDetailsInfoDto,
    mediaDetailsInfoEn: MediaDetailsInfoDto,
    score: number,
  ) {
    return this.prismaService.mediaDetails.update({
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
  }

  async getMediaDetailsItem(
    mediaId: number,
    mediaType: MediaDetailsDto['mediaType'],
  ) {
    return this.prismaService.mediaDetails.findUnique({
      where: {
        mediaId_mediaType: {
          mediaId,
          mediaType,
        },
      },
    });
  }
}
