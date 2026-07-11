import {
  PaginationType,
  UserBan,
  UserBanCreateBodyType,
  UserBanRevokeBodyType,
  UserBansPaginatedType,
} from "@movie-tracker/types"

export const UserBanRepositorySymbol = Symbol("UserBanRepository")

export interface UserBanRepositoryInterface {
  getList: (args: {
    expired?: boolean
    userId?: string
  } & PaginationType) => Promise<UserBansPaginatedType>

  getById: (args: {
    id: string
  }) => Promise<UserBan | undefined>

  getByUserId: (args: {
    userId: string
  }) => Promise<UserBan[]>

  getActiveByUserId: (args: {
    userId: string
  }) => Promise<UserBan | undefined>

  create: (args: UserBanCreateBodyType) => Promise<UserBan>

  revoke: (args: {
    id: string
  } & UserBanRevokeBodyType) => Promise<UserBan | undefined>
}
