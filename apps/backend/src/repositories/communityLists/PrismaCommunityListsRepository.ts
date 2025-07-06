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
    user: {
      select: {
        id: true,
        name: true,
        image: true,
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
      user: data.user
        ? {
            id: data.user.id,
            name: data.user.name,
            image: data.user.image,
          }
        : undefined,
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

  private async selectMediaListsWithCount(arg: Prisma.MediaListFindManyArgs) {
    const { take, skip, ...args } = arg
    const [mediaLists, totalCount] = await this.prisma.$transaction([
      this.prisma.mediaList.findMany({
        ...args,
        take,
        skip,
      }),
      this.prisma.mediaList.count({
        where: args.where,
      }),
    ])

    return {
      items: mediaLists.map(this.convertToInterface),
      totalCount,
    }
  }

  async getSearchResult(args: Parameters<CommunityListsRepositoryInterface["getSearchResult"]>[0]) {
    return this.selectMediaListsWithCount({
      where: {
        title: {
          contains: args.title,
          mode: "insensitive",
        },
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
      },
      include: getMediaListIncludeObject(args.currentUserId),
    })
  }

  async getAllTimeTop(args: Parameters<CommunityListsRepositoryInterface["getAllTimeTop"]>[0]) {
    return this.selectMediaListsWithCount({
      where: {
        title: {
          contains: args.title,
          mode: "insensitive",
        },
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
        likes: {
          some: {},
        },
        mediaItems: {
          some: {},
        },
      },
      orderBy: args.sortBy === "likes"
        ? {
            likes: {
              _count: args.sortDirection,
            },
          }
        : {
            [args.sortBy]: args.sortDirection,
          },
      take: args.limit,
      skip: args.offset,
      include: getMediaListIncludeObject(args.currentUserId),
    })
  }

  async getWeakTop(args: Parameters<CommunityListsRepositoryInterface["getWeakTop"]>[0]) {
    return this.selectMediaListsWithCount({
      where: {
        title: {
          contains: args.title,
          mode: "insensitive",
        },
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
        views: {
          some: {},
        },
        mediaItems: {
          some: {},
        },
        createdAt: {
          gte: args.fromDate,
        },
      },
      orderBy: args.sortBy === "views"
        ? {
            views: {
              _count: args.sortDirection,
            },
          }
        : {
            [args.sortBy]: args.sortDirection,
          },
      take: args.limit,
      skip: args.offset,
      include: getMediaListIncludeObject(args.currentUserId),
    })
  }

  async getNewest(args: Parameters<CommunityListsRepositoryInterface["getNewest"]>[0]) {
    return this.selectMediaListsWithCount({
      where: {
        title: {
          contains: args.title,
          mode: "insensitive",
        },
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
        mediaItems: {
          some: {},
        },
      },
      orderBy: {
        [args.sortBy]: args.sortDirection,
      },
      take: args.limit,
      skip: args.offset,
      include: getMediaListIncludeObject(args.currentUserId),
    })
  }

  async getListsWithMedia(args: Parameters<CommunityListsRepositoryInterface["getListsWithMedia"]>[0]) {
    return this.selectMediaListsWithCount({
      where: {
        mediaItems: {
          some: {
            mediaId: args.mediaId,
          },
        },
        accessLevel: MediaListAccessLevelEnum.PUBLIC,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: args.limit,
      skip: args.offset,
      include: getMediaListIncludeObject(args.currentUserId),
    })
  }
}
