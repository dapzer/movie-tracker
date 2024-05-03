import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryInterface,
  UserRepositorySymbol,
} from '@/repositories/user/UserRepositoryInterface';
import { getUserWithoutPassword } from '@/shared/utils/getUserWithoutPassword';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async getUser(id: string) {
    const user = await this.userRepository.getUserById(id);

    return getUserWithoutPassword(user);
  }

  async deleteUser(id: string, currentUserId: string) {
    if (currentUserId !== id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const deletedUser = await this.userRepository.deleteUser(id);

    return getUserWithoutPassword(deletedUser);
  }
}
