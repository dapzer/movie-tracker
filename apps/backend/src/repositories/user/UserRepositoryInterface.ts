import { UserType } from '@movie-tracker/types';

export const UserRepositorySymbol = Symbol();

export interface UserRepositoryInterface {
  getUserById: (id: string) => Promise<UserType>;

  getUserByEmail: (email: string) => Promise<UserType>;

  createUser: (
    body: Pick<
      UserType,
      'email' | 'name' | 'image' | 'password' | 'isEmailVerified' | "signUpMethod"
    >,
  ) => Promise<UserType>;

  updateUser: (
    id: string,
    body: Partial<Pick<UserType, 'name' | 'image' | 'isEmailVerified'>>,
  ) => Promise<UserType>;

  deleteUser: (id: string) => Promise<UserType>;

  getUsersCount: () => Promise<number>;
}
