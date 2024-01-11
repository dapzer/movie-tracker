import { PrismaService } from '@/services/prisma/prisma.service';
import { MediaListRepositoryInterface } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { MediaListType } from '@movie-tracker/types';
import { MediaList } from '@movie-tracker/database';

@Injectable()
export class PrismaMediaListRepository implements MediaListRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private convertToInterface(data: MediaList): MediaListType {
    return {
      id: data.id,
      userId: data.userId,
      isSystem: data.isSystem,
      isPublic: data.isPublic,
      title: data.title,
      poster: data.poster,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getAllMedialLists(isPublicOnly = false) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        ...(isPublicOnly && { isPublic: true }),
      },
    });

    return mediaLists.map(this.convertToInterface);
  }

  async getMedialListById(id: string) {
    const mediaList = await this.prisma.mediaList.findUnique({
      where: {
        id,
      },
    });

    return this.convertToInterface(mediaList);
  }

  async getMedialListsByUserId(userId: string, isPublicOnly = false) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        userId,
        ...(isPublicOnly && { isPublic: true }),
      },
    });

    return mediaLists.map(this.convertToInterface);
  }

  async createMediaList(
    userId: string,
    isSystem = false,
    body?: Pick<MediaListType, 'title' | 'poster' | 'isPublic'>,
  ) {
    const mediaList = await this.prisma.mediaList.create({
      data: {
        userId,
        isSystem,
        ...(body ?? {}),
      },
    });

    return this.convertToInterface(mediaList);
  }

  async deleteMediaList(id: string) {
    const mediaList = await this.prisma.mediaList.delete({
      where: {
        id,
      },
    });

    return this.convertToInterface(mediaList);
  }

  async updateMediaList(
    id: string,
    body: Pick<MediaListType, 'title' | 'poster' | 'isPublic'>,
  ) {
    const mediaList = await this.prisma.mediaList.update({
      where: { id },
      data: {
        ...body,
      },
    });

    return this.convertToInterface(mediaList);
  }
}
