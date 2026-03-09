import { userFollows, users } from "@movie-tracker/database"
import { and, desc, eq, inArray } from "@movie-tracker/database/drizzle"
import { UserFollowProfileType, UserFollowType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { count } from "drizzle-orm"
import { UserFollowRepositoryInterface } from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type UserFollowRow = typeof userFollows.$inferSelect
type UserRow = typeof users.$inferSelect

@Injectable()
export class DrizzleUserFollowRepository implements UserFollowRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertFollowProfileToInterface(args: {
    user?: UserRow | null
    followersCount?: number
    isFollowing?: boolean
  }): UserFollowProfileType | undefined {
    if (!args.user) {
      return undefined
    }

    return {
      id: args.user.id,
      name: args.user.name,
      image: args.user.image,
      followersCount: args.followersCount ?? 0,
      isFollowing: Boolean(args.isFollowing),
    }
  }

  private convertToInterface(args: {
    userFollow?: UserFollowRow | null
    follower?: UserRow | null
    following?: UserRow | null
    followerFollowersCount?: number
    followingFollowersCount?: number
    followerIsFollowing?: boolean
    followingIsFollowing?: boolean
  }): UserFollowType | undefined {
    if (!args.userFollow) {
      return undefined
    }

    return {
      id: args.userFollow.id,
      followerId: args.userFollow.followerId,
      followingId: args.userFollow.followingId,
      createdAt: args.userFollow.createdAt,
      followerUserProfile: this.convertFollowProfileToInterface({
        user: args.follower,
        followersCount: args.followerFollowersCount,
        isFollowing: args.followerIsFollowing,
      }),
      followingUserProfile: this.convertFollowProfileToInterface({
        user: args.following,
        followersCount: args.followingFollowersCount,
        isFollowing: args.followingIsFollowing,
      }),
    }
  }

  private async getFollowersCountsByUserIds(userIds: string[]) {
    if (!userIds.length) {
      return new Map<string, number>()
    }

    const rows = await this.drizzle.client
      .select({ userId: userFollows.followingId, count: count() })
      .from(userFollows)
      .where(inArray(userFollows.followingId, userIds))
      .groupBy(userFollows.followingId)

    return new Map(rows.map(row => [row.userId, Number(row.count)]))
  }

  private async getFollowingIdsForUser(userId: string, targetIds: string[]) {
    if (!userId || !targetIds.length) {
      return new Set<string>()
    }

    const rows = await this.drizzle.client
      .select({ followingId: userFollows.followingId })
      .from(userFollows)
      .where(and(
        eq(userFollows.followerId, userId),
        inArray(userFollows.followingId, targetIds),
      ))

    return new Set(rows.map(row => row.followingId))
  }

  async create(args: Parameters<UserFollowRepositoryInterface["create"]>[0]) {
    const [userFollow] = await this.drizzle.client
      .insert(userFollows)
      .values({
        followerId: args.followerUserId,
        followingId: args.followingUserId,
      })
      .returning()

    return this.convertToInterface({ userFollow })
  }

  async delete(args: Parameters<UserFollowRepositoryInterface["delete"]>[0]) {
    const [userFollow] = await this.drizzle.client
      .delete(userFollows)
      .where(eq(userFollows.id, args.id))
      .returning()

    return this.convertToInterface({ userFollow })
  }

  async getByFollowerAndFollowingUserId(
    args: Parameters<UserFollowRepositoryInterface["getByFollowerAndFollowingUserId"]>[0],
  ) {
    const [row] = await this.drizzle.client
      .select({ userFollow: userFollows })
      .from(userFollows)
      .where(and(
        eq(userFollows.followerId, args.followerUserId),
        eq(userFollows.followingId, args.followingUserId),
      ))
      .limit(1)

    return row ? this.convertToInterface({ userFollow: row.userFollow }) : undefined
  }

  async getByUserId(args: Parameters<UserFollowRepositoryInterface["getByUserId"]>[0]) {
    const [rows, totalCountResult] = await Promise.all([
      this.drizzle.client
        .select({ userFollow: userFollows, follower: users })
        .from(userFollows)
        .innerJoin(users, eq(users.id, userFollows.followerId))
        .where(eq(userFollows.followingId, args.userId))
        .orderBy(desc(userFollows.createdAt))
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(userFollows)
        .where(eq(userFollows.followingId, args.userId)),
    ])

    const followerIds = rows.map(row => row.follower.id)
    const [followersCountsByUserId, currentUserFollowingIds] = await Promise.all([
      this.getFollowersCountsByUserIds(followerIds),
      this.getFollowingIdsForUser(args.currentUserId, followerIds),
    ])

    return {
      items: rows.map(row => this.convertToInterface({
        userFollow: row.userFollow,
        follower: row.follower,
        followerFollowersCount: followersCountsByUserId.get(row.follower.id) ?? 0,
        followerIsFollowing: currentUserFollowingIds.has(row.follower.id),
      })),
      totalCount: Number(totalCountResult[0]?.count ?? 0),
    }
  }

  async getFollowersCount(args: Parameters<UserFollowRepositoryInterface["getFollowersCount"]>[0]) {
    return this.drizzle.client
      .select({ count: count() })
      .from(userFollows)
      .where(eq(userFollows.followingId, args.userId))
      .then(result => Number(result[0]?.count ?? 0))
  }

  async getFollowings(args: Parameters<UserFollowRepositoryInterface["getFollowings"]>[0]) {
    const [rows, totalCountResult] = await Promise.all([
      this.drizzle.client
        .select({ userFollow: userFollows, following: users })
        .from(userFollows)
        .innerJoin(users, eq(users.id, userFollows.followingId))
        .where(eq(userFollows.followerId, args.userId))
        .orderBy(desc(userFollows.createdAt))
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(userFollows)
        .where(eq(userFollows.followerId, args.userId)),
    ])

    const followingIds = rows.map(row => row.following.id)
    const [followersCountsByUserId, currentUserFollowingIds] = await Promise.all([
      this.getFollowersCountsByUserIds(followingIds),
      this.getFollowingIdsForUser(args.currentUserId, followingIds),
    ])

    return {
      items: rows.map(row => this.convertToInterface({
        userFollow: row.userFollow,
        following: row.following,
        followingFollowersCount: followersCountsByUserId.get(row.following.id) ?? 0,
        followingIsFollowing: currentUserFollowingIds.has(row.following.id),
      })),
      totalCount: Number(totalCountResult[0]?.count ?? 0),
    }
  }

  async getFollowingsCount(args: Parameters<UserFollowRepositoryInterface["getFollowingsCount"]>[0]) {
    return this.drizzle.client
      .select({ count: count() })
      .from(userFollows)
      .where(eq(userFollows.followerId, args.userId))
      .then(result => Number(result[0]?.count ?? 0))
  }
}
