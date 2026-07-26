import type { PaginationType, UserBanCreateBodyType, UserBanStatusFilter } from "@movie-tracker/types"

export interface GetUserBansArgs extends PaginationType {
  status?: UserBanStatusFilter[]
  userId?: string
}

export interface GetUserBanByIdArgs {
  id: string
}

export type CreateUserBanArgs = Omit<UserBanCreateBodyType, "issuedBy">

export interface RevokeUserBanArgs {
  id: string
}
