import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { UpdateUserDto } from "@/routes/user/dto/updateUser.dto"
import { getUserWithoutPassword } from "@/shared/utils/getUserWithoutPassword"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepositoryInterface,
  ) {
  }

  async getUser(id: string) {
    const user = await this.userRepository.getUserById(id)

    return getUserWithoutPassword(user)
  }

  async deleteUser(id: string, currentUserId: string) {
    if (currentUserId !== id) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
    }

    const deletedUser = await this.userRepository.deleteUser(id)

    return getUserWithoutPassword(deletedUser)
  }

  async updateUser(id: string, body: UpdateUserDto) {
    const updatedUser = await this.userRepository.updateUser(id, body)

    return getUserWithoutPassword(updatedUser)
  }
}
