import { UserFollow } from "@movie-tracker/database"
import { UserFollowProfileType, UserFollowType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { UserFollowRepositoryInterface } from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

interface FollowProfile {
  name: string
  id: string
  image: string
  userFollowing?: UserFollow[]
  _count: {
    userFollowing?: number
  }
}

@Injectable()
export class PrismaUserFollowRepository implements UserFollowRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private convertFollowProfileToInterface = (profile: FollowProfile | undefined): UserFollowProfileType => {
    if (!profile) {
      return undefined
    }

    return {
      id: profile.id,
      name: profile.name,
      image: profile.image,
      followersCount: profile._count.userFollowing,
      isFollowing: profile.userFollowing?.length > 0,
    }
  }

  private convertToInterface
    = (userFollow: UserFollow & { follower?: FollowProfile, following?: FollowProfile } | null,
    ): UserFollowType => {
      if (!userFollow) {
        return undefined
      }

      return {
        id: userFollow.id,
        followerId: userFollow.followerId,
        followingId: userFollow.followingId,
        createdAt: userFollow.createdAt,
        followerUserProfile: this.convertFollowProfileToInterface(userFollow.follower),
        followingUserProfile: this.convertFollowProfileToInterface(userFollow.following),
      }
    }

  async create(args: Parameters<UserFollowRepositoryInterface["create"]>[0]) {
    const userFollow = await this.prisma.userFollow.create({
      data: {
        followerId: args.followerUserId,
        followingId: args.followingUserId,
      },
    })

    return this.convertToInterface(userFollow)
  }

  async delete(args: Parameters<UserFollowRepositoryInterface["delete"]>[0]) {
    const userFollow = await this.prisma.userFollow.delete({
      where: {
        id: args.id,
      },
    })

    return this.convertToInterface(userFollow)
  }

  async getByFollowerAndFollowingUserId(args: Parameters<UserFollowRepositoryInterface["getByFollowerAndFollowingUserId"]>[0]) {
    const userFollow = await this.prisma.userFollow.findFirst({
      where: {
        followerId: args.followerUserId,
        followingId: args.followingUserId,
      },
    })

    return this.convertToInterface(userFollow)
  }

  async getByUserId(args: Parameters<UserFollowRepositoryInterface["getByUserId"]>[0]) {
    const [userFollowers, userFollowersCount] = await Promise.all([
      this.prisma.userFollow.findMany({
        where: {
          followingId: args.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: args.limit,
        skip: args.offset,
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
              _count: {
                select: {
                  userFollowing: true,
                },
              },
              userFollowing: args.currentUserId
                ? {
                    where: {
                      followerId: args.currentUserId,
                    },
                  }
                : false,
            },
          },
        },
      }),
      this.prisma.userFollow.count({
        where: {
          followingId: args.userId,
        },
      }),
    ])

    return { items: userFollowers.map(this.convertToInterface), totalCount: userFollowersCount }
  }

  getFollowersCount(args: Parameters<UserFollowRepositoryInterface["getFollowersCount"]>[0]) {
    return this.prisma.userFollow.count({
      where: {
        followingId: args.userId,
      },
    })
  }

  async getFollowings(args: Parameters<UserFollowRepositoryInterface["getFollowings"]>[0]) {
    const [userFollowings, userFollowingsCount] = await Promise.all([this.prisma.userFollow.findMany({
      where: {
        followerId: args.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            image: true,
            _count: {
              select: {
                userFollowing: true,
              },
            },
            userFollowing: args.currentUserId
              ? {
                  where: {
                    followerId: args.currentUserId,
                  },
                }
              : false,
          },
        },
      },
    }), this.prisma.userFollow.count({
      where: {
        followerId: args.userId,
      },
    })])

    return {
      items: userFollowings.map(this.convertToInterface),
      totalCount: userFollowingsCount,
    }
  }

  getFollowingsCount(args: Parameters<UserFollowRepositoryInterface["getFollowingsCount"]>[0]) {
    return this.prisma.userFollow.count({
      where: {
        followerId: args.userId,
      },
    })
  }
}
