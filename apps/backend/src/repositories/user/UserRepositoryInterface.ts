import { UserStatsType, UserType } from "@movie-tracker/types"

export const UserRepositorySymbol = Symbol("UserRepository")

export interface UserRepositoryInterface {
  getById: (id: string) => Promise<UserType>

  getStatsById: (id: string) => Promise<UserStatsType>

  getByEmail: (email: string) => Promise<UserType>

  create: (args: {
    body: Pick<
      UserType,
      "email" | "name" | "image" | "password" | "isEmailVerified" | "signUpMethod"
    >
  }) => Promise<UserType>

  update: (args: {
    id: string
    body: Partial<Pick<UserType, "name" | "image" | "isEmailVerified" | "password" | "email" | "mediaRatingsAccessLevel">>
  }) => Promise<UserType>

  delete: (id: string) => Promise<UserType>

  getCount: () => Promise<number>
}
