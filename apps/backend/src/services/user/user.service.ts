import { UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { UpdateUserDto } from "@/services/user/dto/updateUser.dto"
import { UserNotFoundError, UserUnauthorizedError } from "@/shared/errors/user"
import { getUserWithoutPassword } from "@/shared/utils/getUserWithoutPassword"

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepositoryInterface,
  ) {
  }

  async getById(id: string) {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundError({ userId: id })
    }

    return getUserWithoutPassword(user)
  }

  async getStatsByUserId(args: { currentUserId?: string, userId?: string }) {
    const [user, stats] = await Promise.all([
      this.userRepository.getById(args.userId),
      this.userRepository.getStatsById(args.userId),
    ])

    if (!user) {
      throw new UserNotFoundError({ userId: args.userId })
    }

    if (user.mediaRatingsAccessLevel !== UserMediaRatingsAccessLevelEnum.PUBLIC && args.currentUserId !== args.userId) {
      stats.mediaRatingsCount = undefined
    }

    return stats
  }

  async delete(id: string, currentUserId: string) {
    if (currentUserId !== id) {
      throw new UserUnauthorizedError({ userId: currentUserId, targetUserId: id })
    }

    const deletedUser = await this.userRepository.delete(id)

    return getUserWithoutPassword(deletedUser)
  }

  async update(id: string, body: UpdateUserDto) {
    const updatedUser = await this.userRepository.update({ id, body })

    return getUserWithoutPassword(updatedUser)
  }
}
