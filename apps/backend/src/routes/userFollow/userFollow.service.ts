import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import {
  UserFollowRepositoryInterface,
  UserFollowRepositorySymbol,
} from "@/repositories/userFollow/UserFollowRepositoryInterface"

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

  async getUserFollowers(userId: string) {
    await this.checkUserExists(userId)

    return this.userFollowRepository.getFollowers({ userId })
  }

  async createUserFollow(followerId: string, followingUserId: string) {
    await this.checkUserExists(followingUserId)

    if (followerId === followingUserId) {
      throw new Error("Users cannot follow themselves.")
    }

    return this.userFollowRepository.createFollow({ followerId, followingUserId })
  }

  async deleteUserFollow(followerId: string, followingUserId: string) {
    await this.checkUserExists(followingUserId)

    if (followerId === followingUserId) {
      throw new Error("Users cannot unfollow themselves.")
    }

    const userFollow = await this.userFollowRepository.getFollow({ followerId, followingUserId })

    if (!userFollow) {
      throw new HttpException("Follow not found", HttpStatus.NOT_FOUND)
    }

    return this.userFollowRepository.deleteFollow({ id: userFollow.id })
  }
}
