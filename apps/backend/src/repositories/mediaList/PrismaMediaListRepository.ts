import { PrismaService } from '@/services/prisma/prisma.service';
import { MediaListRepositoryInterface } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { MediaListDto } from '@/routes/mediaList/dto/mediaList.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMediaListRepository implements MediaListRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMedialLists(isPublicOnly = false) {
    return this.prisma.mediaList.findMany({
      where: {
        ...(isPublicOnly && { isPublic: true }),
      },
    });
  }

  async getMedialListById(id: string) {
    return this.prisma.mediaList.findUnique({
      where: {
        id,
      },
    });
  }

  async getMedialListsByUserId(userId: string, isPublicOnly = false) {
    return this.prisma.mediaList.findMany({
      where: {
        userId,
        ...(isPublicOnly && { isPublic: true }),
      },
    });
  }

  async createMediaList(userId: string, isSystem = false) {
    return this.prisma.mediaList.create({
      data: {
        userId,
        isSystem,
      },
    });
  }

  async deleteMediaList(id: string) {
    return this.prisma.mediaList.delete({
      where: {
        id,
      },
    });
  }

  async updateMediaList(
    id: string,
    body: Pick<MediaListDto, 'title' | 'poster' | 'isPublic'>,
  ) {
    return this.prisma.mediaList.update({
      where: { id },
      data: {
        ...body,
      },
    });
  }
}
