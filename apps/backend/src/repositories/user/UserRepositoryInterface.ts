import { UserType } from '@movie-tracker/types';

export const UserRepositorySymbol = Symbol();

export interface UserRepositoryInterface {
  getUserById: (id: string) => Promise<UserType>;

  createUser: (
    body: Pick<UserType, 'email' | 'name' | 'image'>,
  ) => Promise<UserType>;

  updateUser: (
    id: string,
    body: Partial<Pick<UserType, 'name' | 'image'>>,
  ) => Promise<UserType>;

  deleteUser: (id: string) => Promise<UserType>;
}
