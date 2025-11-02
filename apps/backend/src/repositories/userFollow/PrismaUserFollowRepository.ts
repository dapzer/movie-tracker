import { UserFollow } from "@movie-tracker/database"
import { UserFollowProfileType, UserFollowType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { UserFollowRepositoryInterface } from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

interface FollowProfile {
  name: string
  id: string
  image: string
  _count: {
    userFollowers: number
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
      followersCount: profile._count.userFollowers,
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

  async createFollow(args: Parameters<UserFollowRepositoryInterface["createFollow"]>[0]) {
    const userFollow = await this.prisma.userFollow.create({
      data: {
        followerId: args.followerUserId,
        followingId: args.followingUserId,
      },
    })

    return this.convertToInterface(userFollow)
  }

  async deleteFollow(args: Parameters<UserFollowRepositoryInterface["deleteFollow"]>[0]) {
    const userFollow = await this.prisma.userFollow.delete({
      where: {
        id: args.id,
      },
    })

    return this.convertToInterface(userFollow)
  }

  async getFollow(args: Parameters<UserFollowRepositoryInterface["getFollow"]>[0]) {
    const userFollow = await this.prisma.userFollow.findFirst({
      where: {
        followerId: args.followerUserId,
        followingId: args.followingUserId,
      },
    })

    return this.convertToInterface(userFollow)
  }

  async getFollowers(args: Parameters<UserFollowRepositoryInterface["getFollowers"]>[0]) {
    const userFollowers = await this.prisma.userFollow.findMany({
      where: {
        followingId: args.userId,
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
                userFollowers: true,
              },
            },
          },
        },
      },
    })

    return userFollowers.map(this.convertToInterface)
  }

  getFollowersCount(args: Parameters<UserFollowRepositoryInterface["getFollowersCount"]>[0]) {
    return this.prisma.userFollow.count({
      where: {
        followingId: args.userId,
      },
    })
  }

  async getFollowing(args: Parameters<UserFollowRepositoryInterface["getFollowing"]>[0]) {
    const userFollowing = await this.prisma.userFollow.findMany({
      where: {
        followerId: args.userId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            image: true,
            _count: {
              select: {
                userFollowers: true,
              },
            },
          },
        },
      },
    })

    return userFollowing.map(this.convertToInterface)
  }

  getFollowingCount(args: Parameters<UserFollowRepositoryInterface["getFollowingCount"]>[0]) {
    return this.prisma.userFollow.count({
      where: {
        followerId: args.userId,
      },
    })
  }
}
