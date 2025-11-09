import { UserFollowInformationType } from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import {
  UserFollowRepositoryInterface,
  UserFollowRepositorySymbol,
} from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { PaginationDto } from "@/shared/dto/pagination.dto"

@Injectable()
export class UserFollowService {
  constructor(
    @Inject(UserFollowRepositorySymbol) private readonly userFollowRepository: UserFollowRepositoryInterface,
    @Inject(UserRepositorySymbol) private readonly userRepository: UserRepositoryInterface,
  ) {
  }

  private async checkUserExists(userId: string) {
    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }
  }

  async getUserFollowers(args: { userId: string, currentUserId: string } & PaginationDto) {
    await this.checkUserExists(args.userId)

    return this.userFollowRepository.getFollowers({ userId: args.userId, limit: args.limit, offset: args.offset, currentUserId: args.currentUserId })
  }

  async getUserFollowings(args: { userId: string, currentUserId: string } & PaginationDto) {
    await this.checkUserExists(args.userId)

    return this.userFollowRepository.getFollowings({ userId: args.userId, limit: args.limit, offset: args.offset, currentUserId: args.currentUserId })
  }

  async createUserFollow(args: { followerUserId: string, followingUserId: string }) {
    await this.checkUserExists(args.followingUserId)

    if (args.followerUserId === args.followingUserId) {
      throw new Error("Users cannot follow themselves.")
    }

    return this.userFollowRepository.createFollow({ followerUserId: args.followerUserId, followingUserId: args.followingUserId })
  }

  async deleteUserFollow(args: { followerUserId: string, followingUserId: string }) {
    await this.checkUserExists(args.followingUserId)

    if (args.followerUserId === args.followingUserId) {
      throw new Error("Users cannot unfollow themselves.")
    }

    const userFollow = await this.userFollowRepository.getFollow({ followerUserId: args.followerUserId, followingUserId: args.followingUserId })

    if (!userFollow) {
      throw new HttpException("Follow not found", HttpStatus.NOT_FOUND)
    }

    return this.userFollowRepository.deleteFollow({ id: userFollow.id })
  }

  async getUserFollowInformation(args: { userId: string, currentUserId?: string }): Promise<UserFollowInformationType> {
    await this.checkUserExists(args.userId)

    const [followersCount, follow] = await Promise.all([
      this.userFollowRepository.getFollowersCount({ userId: args.userId }),
      args.currentUserId
        ? this.userFollowRepository.getFollow({ followerUserId: args.currentUserId, followingUserId: args.userId })
        : Promise.resolve(undefined),
    ])

    return {
      followersCount,
      isFollowing: !!follow,
    }
  }
}
