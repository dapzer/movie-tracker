import type { PaginationType, UserBanCreateBodyType } from "@movie-tracker/types"

export interface GetUserBansArgs extends PaginationType {
  expired?: boolean
  userId?: string
}

export interface GetUserBanByIdArgs {
  id: string
}

export type CreateUserBanArgs = Omit<UserBanCreateBodyType, "issuedBy">

export interface RevokeUserBanArgs {
  id: string
}
