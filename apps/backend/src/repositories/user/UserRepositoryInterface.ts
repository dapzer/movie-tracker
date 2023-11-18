import { UserDto } from '@/routes/auth/dto/user.dto';

export const UserRepositorySymbol = Symbol();

export interface UserRepositoryInterface {
  getUserById: (id: string) => Promise<UserDto>;

  createUser: (
    body: Pick<UserDto, 'email' | 'name' | 'image'>,
  ) => Promise<UserDto>;

  updateUser: (
    id: string,
    body: Partial<Pick<UserDto, 'name' | 'image'>>,
  ) => Promise<UserDto>;

  deleteUser: (id: string) => Promise<UserDto>;
}
