import { NotificationTypeEnum, UserFollowInformationType } from "@movie-tracker/types"
import { Inject, Injectable, Logger } from "@nestjs/common"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import {
  UserFollowRepositoryInterface,
  UserFollowRepositorySymbol,
} from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { NotificationService } from "@/routes/notification/notification.service"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UserNotFoundError } from "@/shared/errors/user"
import { SelfFollowError, SelfUnfollowError, UserFollowNotFoundError } from "@/shared/errors/userFollow"

@Injectable()
export class UserFollowService {
  private readonly logger = new Logger("UserFollowService")

  constructor(
    @Inject(UserFollowRepositorySymbol) private readonly userFollowRepository: UserFollowRepositoryInterface,
    @Inject(UserRepositorySymbol) private readonly userRepository: UserRepositoryInterface,
    private readonly notificationService: NotificationService,
  ) {
  }

  private async checkUserExists(userId: string) {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new UserNotFoundError({ userId })
    }
  }

  async getFollowers(args: { userId: string, currentUserId: string } & PaginationDto) {
    await this.checkUserExists(args.userId)

    return this.userFollowRepository.getByUserId({ userId: args.userId, limit: args.limit, offset: args.offset, currentUserId: args.currentUserId })
  }

  async getFollowings(args: { userId: string, currentUserId: string } & PaginationDto) {
    await this.checkUserExists(args.userId)

    return this.userFollowRepository.getFollowings({ userId: args.userId, limit: args.limit, offset: args.offset, currentUserId: args.currentUserId })
  }

  async create(args: { followerUserId: string, followingUserId: string }) {
    await this.checkUserExists(args.followingUserId)

    if (args.followerUserId === args.followingUserId) {
      throw new SelfFollowError({ userId: args.followerUserId })
    }

    const follow = await this.userFollowRepository.create({ followerUserId: args.followerUserId, followingUserId: args.followingUserId })

    if (follow) {
      await this.notificationService.create({
        userId: args.followingUserId,
        type: NotificationTypeEnum.USER_FOLLOW,
        meta: {
          actorUserId: args.followerUserId,
        },
        createdAt: follow.createdAt,
      }).catch((err) => {
        this.logger.error("Failed to create follow notification", err)
      })
    }

    return follow
  }

  async deleteUser(args: { followerUserId: string, followingUserId: string }) {
    await this.checkUserExists(args.followingUserId)

    if (args.followerUserId === args.followingUserId) {
      throw new SelfUnfollowError({ userId: args.followerUserId })
    }

    const userFollow = await this.userFollowRepository.getByFollowerAndFollowingUserId({ followerUserId: args.followerUserId, followingUserId: args.followingUserId })

    if (!userFollow) {
      throw new UserFollowNotFoundError({ followerUserId: args.followerUserId, followingUserId: args.followingUserId })
    }

    return this.userFollowRepository.delete({ id: userFollow.id })
  }

  async getUserFollowInformation(args: { userId: string, currentUserId?: string }): Promise<UserFollowInformationType> {
    await this.checkUserExists(args.userId)

    const [followersCount, follow] = await Promise.all([
      this.userFollowRepository.getFollowersCount({ userId: args.userId }),
      args.currentUserId
        ? this.userFollowRepository.getByFollowerAndFollowingUserId({ followerUserId: args.currentUserId, followingUserId: args.userId })
        : Promise.resolve(undefined),
    ])

    return {
      followersCount,
      isFollowing: !!follow,
    }
  }
}
