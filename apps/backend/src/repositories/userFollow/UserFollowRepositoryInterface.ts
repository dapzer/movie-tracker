import { UserFollowType } from "@movie-tracker/types"

export const UserFollowRepositorySymbol = Symbol("UserFollowRepository")

export interface UserFollowRepositoryInterface {
  createFollow: (args: { followerUserId: string, followingUserId: string }) => Promise<UserFollowType>
  deleteFollow: (args: { id: string }) => Promise<UserFollowType>
  getFollow: (args: { followerUserId: string, followingUserId: string }) => Promise<UserFollowType>
  getFollowers: (args: { userId: string, limit: number, offset: number }) => Promise<UserFollowType[]>
  getFollowersCount: (args: { userId: string }) => Promise<number>
  getFollowing: (args: { userId: string }) => Promise<UserFollowType[]>
  getFollowingCount: (args: { userId: string }) => Promise<number>
}
