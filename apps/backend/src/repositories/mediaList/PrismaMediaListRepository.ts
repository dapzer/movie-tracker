import { MediaListRepositoryInterface } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"
import { MediaListLike, Prisma } from "@movie-tracker/database"
import { DefaultArgs } from "@movie-tracker/database/dist/runtime/library"
import {
  MediaDetailsType,
  MediaListCreateBodyType,
  MediaListLikeType,
  MediaListType,
  MediaListUpdateBodyType,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { init } from "@paralleldrive/cuid2"

function getMediaListIncludeObject(currentUserId?: string) {
  return ({
    _count: {
      select: {
        mediaItems: true,
        likes: true,
      },
    },
    likes: currentUserId && {
      where: {
        userId: currentUserId,
      },
    },
    mediaItems: {
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        mediaDetails: {
          select: {
            ru: true,
            en: true,
          },
        },
      },
    },
  }) satisfies Prisma.MediaListInclude<DefaultArgs>
}

type MediaListReturnType = Prisma.MediaListGetPayload<{
  include: ReturnType<typeof getMediaListIncludeObject>
}>

@Injectable()
export class PrismaMediaListRepository implements MediaListRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {
  }

  private convertLikeToInterface(data: MediaListLike): MediaListLikeType {
    return {
      id: data.id,
      mediaListId: data.mediaListId,
      userId: data.userId,
      createdAt: data.createdAt,
    }
  }

  private convertToInterface(
    data: Partial<MediaListReturnType>,
  ): MediaListType {
    return {
      id: data.id,
      humanFriendlyId: data.humanFriendlyId,
      userId: data.userId,
      isSystem: data.isSystem,
      isPublic: data.isPublic,
      title: data.title,
      description: data.description,
      likesCount: data._count?.likes,
      mediaItemsCount: data._count?.mediaItems,
      isLiked: !!data.likes?.length,
      poster: data.mediaItems?.reduce((acc, el) => {
        acc.ru.push((el.mediaDetails as unknown as MediaDetailsType).ru.poster)
        acc.en.push((el.mediaDetails as unknown as MediaDetailsType).en.poster)

        return acc
      }, { en: [], ru: [] }),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  async getAllMedialLists(isPublicOnly = false, currentUserId?: string) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        ...(isPublicOnly && { isPublic: true }),
      },
      include: getMediaListIncludeObject(currentUserId),
    })

    return mediaLists.map((el) => {
      return this.convertToInterface(el)
    })
  }

  async getMedialListById(id: string, currentUserId?: string) {
    const mediaList = await this.prisma.mediaList.findUnique({
      where: {
        id,
      },
      include: getMediaListIncludeObject(currentUserId),
    })

    return this.convertToInterface(mediaList)
  }

  async getMedialListByHumanFriendlyId(id: string, currentUserId?: string) {
    const mediaList = await this.prisma.mediaList.findUnique({
      where: {
        humanFriendlyId: id,
      },
      include: getMediaListIncludeObject(currentUserId),
    })

    return this.convertToInterface(mediaList)
  }

  async getMedialListsByUserId(userId: string, currentUserId: string, isPublicOnly = false) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        userId,
        ...(isPublicOnly && { isPublic: true }),
      },
      include: getMediaListIncludeObject(currentUserId),
    })

    return mediaLists.map((el) => {
      return this.convertToInterface(el)
    })
  }

  async getMedialListByMediaItemAndUserId(mediaItemId: string, userId: string, currentUserId?: string) {
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
      include: getMediaListIncludeObject(currentUserId),
    })

    return this.convertToInterface(mediaList)
  }

  async createMediaList(
    userId: string,
    isSystem = false,
    body?: MediaListCreateBodyType,
  ) {
    const generateCuid = init({ length: 10 })
    const mediaList = await this.prisma.mediaList.create({
      data: {
        userId,
        humanFriendlyId: generateCuid(),
        isSystem,
        ...(body ?? {}),
      },
      include: getMediaListIncludeObject(),
    })

    return this.convertToInterface(mediaList)
  }

  async deleteMediaList(id: string) {
    const mediaList = await this.prisma.mediaList.delete({
      where: {
        id,
      },
    })

    return this.convertToInterface(mediaList)
  }

  async updateMediaList(
    id: string,
    body: MediaListUpdateBodyType,
  ) {
    const mediaList = await this.prisma.mediaList.update({
      where: { id },
      data: {
        ...body,
      },
      include: getMediaListIncludeObject(),
    })

    return this.convertToInterface(mediaList)
  }

  async getMediaListsCount() {
    return this.prisma.mediaList.count()
  }

  async getMediaListsCountByUserId(userId: string) {
    return this.prisma.mediaList.count({
      where: {
        userId,
      },
    })
  }

  async createMediaListLike(mediaListId: string, userId: string) {
    const mediaListLike = await this.prisma.mediaListLike.create({
      data: {
        mediaListId,
        userId,
      },
    })

    return this.convertLikeToInterface(mediaListLike)
  }

  async deleteMediaListLike(mediaListId: string, userId: string) {
    const mediaListLike = await this.prisma.mediaListLike.delete({
      where: {
        mediaListId_userId: {
          mediaListId,
          userId,
        },
      },
    })

    return this.convertLikeToInterface(mediaListLike)
  }
}
