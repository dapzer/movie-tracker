import { UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { UpdateUserDto } from "@/routes/user/dto/updateUser.dto"
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
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    return getUserWithoutPassword(user)
  }

  async getStatsByUserId(args: { currentUserId?: string, userId?: string }) {
    const [user, stats] = await Promise.all([
      this.userRepository.getById(args.userId),
      this.userRepository.getStatsById(args.userId),
    ])

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    if (user.mediaRatingsAccessLevel !== UserMediaRatingsAccessLevelEnum.PUBLIC && args.currentUserId !== args.userId) {
      stats.mediaRatingsCount = undefined
    }

    return stats
  }

  async delete(id: string, currentUserId: string) {
    if (currentUserId !== id) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
    }

    const deletedUser = await this.userRepository.delete(id)

    return getUserWithoutPassword(deletedUser)
  }

  async update(id: string, body: UpdateUserDto) {
    const updatedUser = await this.userRepository.update({ id, body })

    return getUserWithoutPassword(updatedUser)
  }
}
