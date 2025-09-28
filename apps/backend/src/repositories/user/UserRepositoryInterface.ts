import { UserStatsType, UserType } from "@movie-tracker/types"

export const UserRepositorySymbol = Symbol("UserRepository")

export interface UserRepositoryInterface {
  getUserById: (id: string) => Promise<UserType>

  getUserStatsById: (id: string) => Promise<UserStatsType>

  getUserByEmail: (email: string) => Promise<UserType>

  createUser: (
    body: Pick<
      UserType,
      "email" | "name" | "image" | "password" | "isEmailVerified" | "signUpMethod"
    >,
  ) => Promise<UserType>

  updateUser: (
    id: string,
    body: Partial<Pick<UserType, "name" | "image" | "isEmailVerified" | "password" | "email" | "mediaRatingsAccessLevel">>,
  ) => Promise<UserType>

  deleteUser: (id: string) => Promise<UserType>

  getUsersCount: () => Promise<number>
}
