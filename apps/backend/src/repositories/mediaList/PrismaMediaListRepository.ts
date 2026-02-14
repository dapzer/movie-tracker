import { MediaListLike, Prisma } from "@movie-tracker/database"
import { DefaultArgs } from "@movie-tracker/database/dist/runtime/library"
import { MediaDetailsType, MediaListAccessLevelEnum, MediaListLikeType, MediaListType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { init } from "@paralleldrive/cuid2"
import { MediaListRepositoryInterface } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

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
      accessLevel: MediaListAccessLevelEnum[data.accessLevel],
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

  async getById(args: Parameters<MediaListRepositoryInterface["getById"]>[0]) {
    const mediaList = await this.prisma.mediaList.findUnique({
      where: {
        id: args.id,
      },
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return this.convertToInterface(mediaList)
  }

  async getByIds(args: Parameters<MediaListRepositoryInterface["getByIds"]>[0]) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        id: {
          in: args.ids,
        },
      },
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return mediaLists.map(this.convertToInterface)
  }

  async getByHumanFriendlyId(
    args: Parameters<MediaListRepositoryInterface["getByHumanFriendlyId"]>[0],
  ) {
    const mediaList = await this.prisma.mediaList.findUnique({
      where: {
        humanFriendlyId: args.id,
      },
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return this.convertToInterface(mediaList)
  }

  async getByUserId(
    args: Parameters<MediaListRepositoryInterface["getByUserId"]>[0],
  ) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        userId: args.userId,
        ...(args.isPublicOnly && { accessLevel: MediaListAccessLevelEnum.PUBLIC }),
      },
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return mediaLists.map((el) => {
      return this.convertToInterface(el)
    })
  }

  async getByMediaItemAndUserId(
    args: Parameters<MediaListRepositoryInterface["getByMediaItemAndUserId"]>[0],
  ) {
    const mediaList = await this.prisma.mediaList.findFirst({
      where: {
        userId: args.userId,
        AND: {
          mediaItems: {
            some: {
              id: args.mediaItemId,
            },
          },
        },
      },
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return this.convertToInterface(mediaList)
  }

  async create(args: Parameters<MediaListRepositoryInterface["create"]>[0]) {
    const generateCuid = init({ length: 10 })
    const mediaList = await this.prisma.mediaList.create({
      data: {
        userId: args.userId,
        humanFriendlyId: generateCuid(),
        isSystem: args.isSystem ?? false,
        ...(args.body ?? {}),
      },
      include: getMediaListIncludeObject(),
    })

    return this.convertToInterface(mediaList)
  }

  async delete(id: string) {
    const mediaList = await this.prisma.mediaList.delete({
      where: {
        id,
      },
    })

    return this.convertToInterface(mediaList)
  }

  async update(args: Parameters<MediaListRepositoryInterface["update"]>[0]) {
    const mediaList = await this.prisma.mediaList.update({
      where: { id: args.id },
      data: {
        ...args.body,
      },
      include: getMediaListIncludeObject(),
    })

    return this.convertToInterface(mediaList)
  }

  async getCount() {
    return this.prisma.mediaList.count()
  }

  async getCountByUserId(userId: string) {
    return this.prisma.mediaList.count({
      where: {
        userId,
      },
    })
  }

  async createLike(
    args: Parameters<MediaListRepositoryInterface["createLike"]>[0],
  ) {
    const mediaListLike = await this.prisma.mediaListLike.create({
      data: {
        mediaListId: args.mediaListId,
        userId: args.userId,
      },
    })

    return this.convertLikeToInterface(mediaListLike)
  }

  async deleteLike(
    args: Parameters<MediaListRepositoryInterface["deleteLike"]>[0],
  ) {
    const mediaListLike = await this.prisma.mediaListLike.delete({
      where: {
        mediaListId_userId: {
          mediaListId: args.mediaListId,
          userId: args.userId,
        },
      },
    })

    return this.convertLikeToInterface(mediaListLike)
  }
}
