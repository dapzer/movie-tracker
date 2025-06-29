import { CommunityListsRepositoryInterface } from "@/repositories/communityLists/CommunityListsRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"
import { Prisma } from "@movie-tracker/database"
import { DefaultArgs } from "@movie-tracker/database/dist/runtime/library"
import { MediaDetailsType, MediaListAccessLevelEnum, MediaListType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"

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
export class PrismaCommunityListsRepository implements CommunityListsRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {
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

  async getByTitle(args: Parameters<CommunityListsRepositoryInterface["getByTitle"]>[0]) {
    const mediaList = await this.prisma.mediaList.findFirst({
      where: {
        title: {
          contains: args.title,
          mode: "insensitive",
        },
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
      },
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return this.convertToInterface(mediaList)
  }

  async getAllTimeTop(args: Parameters<CommunityListsRepositoryInterface["getWeakTop"]>[0]) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
        likes: {
          some: {},
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      take: args.limit,
      skip: args.offset,
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return mediaLists.map(this.convertToInterface)
  }

  async getWeakTop(args: Parameters<CommunityListsRepositoryInterface["getWeakTop"]>[0]) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
        views: {
          some: {},
        },
        createdAt: {
          gte: args.fromDate,
        },
      },
      orderBy: {
        views: {
          _count: "desc",
        },
      },
      take: args.limit,
      skip: args.offset,
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return mediaLists.map(this.convertToInterface)
  }

  async getNewest(args: Parameters<CommunityListsRepositoryInterface["getNewest"]>[0]) {
    const mediaLists = await this.prisma.mediaList.findMany({
      where: {
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: args.limit,
      skip: args.offset,
      include: getMediaListIncludeObject(args.currentUserId),
    })

    return mediaLists.map(this.convertToInterface)
  }
}
