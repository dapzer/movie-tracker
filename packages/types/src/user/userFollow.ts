import { UserType } from "./user"

export interface UserFollowType {
  id: string
  followerId: string
  followingId: string
  createdAt: Date
  followerUserProfile?: UserFollowProfileType
  followingUserProfile?: UserFollowProfileType
}

export type UserFollowProfileType = Pick<UserType, "id" | "name" | "image"> & {
  followersCount: number
}

export interface UserFollowInformationType {
  followersCount: number
  isFollowing: boolean
}
