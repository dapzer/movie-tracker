import { PrismaService } from '@/services/prisma/prisma.service';
import { MediaListRepositoryInterface } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { MediaListLikeType, MediaListType } from '@movie-tracker/types';
import { MediaList, MediaListLike } from '@movie-tracker/database';
import { init } from '@paralleldrive/cuid2';

@Injectable()
export class PrismaMediaListRepository implements MediaListRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private convertLikeToInterface(data: MediaListLike): MediaListLikeType {
    return {
      id: data.id,
      mediaListId: data.mediaListId,
      userId: data.userId,
      createdAt: data.createdAt,
    };
  }

  private convertToInterface(
    data: MediaList & { likes: MediaListLike[] },
    userId?: string,
  ): MediaListType {
    return {
      id: data.id,
      humanFriendlyId: data.humanFriendlyId,
      userId: data.userId,
      isSystem: data.isSystem,
      isPublic: data.isPublic,
      title: data.title,
      poster: data.poster,
      likesCount: data.likes.length,
      isLiked: userId
        ? data.likes.some((like) => like.userId === userId)
        : false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getAllMedialLists(isPublicOnly = false, userId?: string) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        ...(isPublicOnly && { isPublic: true }),
      },
      include: {
        likes: true,
      },
    });

    return mediaLists.map((el) => {
      return this.convertToInterface(el, userId);
    });
  }

  async getMedialListById(id: string, userId?: string) {
    const mediaList = await this.prisma.mediaList.findUnique({
      where: {
        id,
      },
      include: {
        likes: true,
      },
    });

    return this.convertToInterface(mediaList, userId);
  }

  async getMedialListByHumanFriendlyId(id: string, userId?: string) {
    const mediaList = await this.prisma.mediaList.findUnique({
      where: {
        humanFriendlyId: id,
      },
      include: {
        likes: true,
      },
    });

    return this.convertToInterface(mediaList, userId);
  }

  async getMedialListsByUserId(userId: string, isPublicOnly = false) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        userId,
        ...(isPublicOnly && { isPublic: true }),
      },
      include: {
        likes: true,
      },
    });

    return mediaLists.map((el) => {
      return this.convertToInterface(el, userId);
    });
  }

  async getMedialListByMediaItemAndUserId(mediaItemId: string, userId: string) {
    const mediaList = await this.prisma.mediaList.findFirst({
      where: {
        userId,
        AND: {
          mediaItems: {
            some: {
              id: mediaItemId,
            },
          },
        },
      },
      include: {
        likes: true,
      },
    });

    return this.convertToInterface(mediaList, userId);
  }

  async createMediaList(
    userId: string,
    isSystem = false,
    body?: Pick<MediaListType, 'title' | 'poster' | 'isPublic'>,
  ) {
    const generateCuid = init({ length: 10 });
    const mediaList = await this.prisma.mediaList.create({
      data: {
        userId,
        humanFriendlyId: generateCuid(),
        isSystem,
        ...(body ?? {}),
      },
      include: {
        likes: true,
      },
    });

    return this.convertToInterface(mediaList);
  }

  async deleteMediaList(id: string) {
    const mediaList = await this.prisma.mediaList.delete({
      where: {
        id,
      },
      include: {
        likes: true,
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
      include: {
        likes: true,
      },
    });

    return this.convertToInterface(mediaList);
  }

  async getMediaListsCount() {
    return this.prisma.mediaList.count();
  }

  async createMediaListLike(mediaListId: string, userId: string) {
    const mediaListLike = await this.prisma.mediaListLike.create({
      data: {
        mediaListId,
        userId,
      },
    });

    return this.convertLikeToInterface(mediaListLike);
  }

  async deleteMediaListLike(mediaListId: string, userId: string) {
    const mediaListLike = await this.prisma.mediaListLike.delete({
      where: {
        mediaListId_userId: {
          mediaListId,
          userId,
        },
      },
    });

    return this.convertLikeToInterface(mediaListLike);
  }
}
