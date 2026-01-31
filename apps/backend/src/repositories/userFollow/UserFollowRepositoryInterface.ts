import { UserFollowersPaginatedType, UserFollowingsPaginatedType, UserFollowType } from "@movie-tracker/types"

export const UserFollowRepositorySymbol = Symbol("UserFollowRepository")

export interface UserFollowRepositoryInterface {
  create: (args: {
    followerUserId: string
    followingUserId: string
  }) => Promise<UserFollowType>
  delete: (args: {
    id: string
  }) => Promise<UserFollowType>
  getByFollowerAndFollowingUserId: (args: {
    followerUserId: string
    followingUserId: string
  }) => Promise<UserFollowType>
  getByUserId: (args: {
    userId: string
    currentUserId: string
    limit: number
    offset: number
  }) => Promise<UserFollowersPaginatedType>
  getFollowersCount: (args: {
    userId: string
  }) => Promise<number>
  getFollowings: (args: {
    userId: string
    currentUserId: string
    limit: number
    offset: number
  }) => Promise<UserFollowingsPaginatedType>
  getFollowingsCount: (args: {
    userId: string
  }) => Promise<number>
}
