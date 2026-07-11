import type { UserBan, UserBansPaginatedType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  CreateUserBanArgs,
  GetUserBanByIdArgs,
  GetUserBansArgs,
  RevokeUserBanArgs,
} from "~/api/userBans/userBansApiTypes"
import { api } from "~/api/instance"

export function getUserBansApi(args: GetUserBansArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<UserBansPaginatedType>("user-bans", {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
      expired: args.expired,
      userId: args.userId,
    },
  })
}

export function getUserBanByIdApi(args: GetUserBanByIdArgs, options?: RequestOptions) {
  return api.get<UserBan>(`user-bans/${args.id}`, options)
}

export function createUserBanApi(args: CreateUserBanArgs, options?: RequestOptions) {
  return api.post<UserBan>("user-bans", args, options)
}

export function revokeUserBanApi(args: RevokeUserBanArgs, options?: RequestOptions) {
  return api.patch<UserBan>(`user-bans/${args.id}/revoke`, undefined, options)
}
