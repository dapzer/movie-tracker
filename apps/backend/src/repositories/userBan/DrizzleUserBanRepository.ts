import { userBans, users } from "@movie-tracker/database"
import {
  BanReason,
  SignUpMethodEnum,
  UserBan,
  UserMediaRatingsAccessLevelEnum,
  UserPublicType,
  UserRoleEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { and, count, desc, eq, gt, isNotNull, isNull, lte, or, SQL } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import { UserBanRepositoryInterface } from "@/repositories/userBan/UserBanRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { getPublicUser } from "@/shared/utils/getPublicUser"

type UserBanRow = typeof userBans.$inferSelect
type UserRow = typeof users.$inferSelect

const issuerUsers = alias(users, "issuer_users")
const revokerUsers = alias(users, "revoker_users")

@Injectable()
export class DrizzleUserBanRepository implements UserBanRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertUserToInterface(user?: UserRow | null): UserPublicType | null {
    if (!user) {
      return null
    }

    return getPublicUser({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      signUpMethod: SignUpMethodEnum[user.signUpMethod],
      isEmailVerified: user.isEmailVerified,
      password: user.password,
      roles: user.roles.map(role => UserRoleEnum[role]),
      mediaRatingsAccessLevel: UserMediaRatingsAccessLevelEnum[user.mediaRatingsAccessLevel],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

  private convertToInterface(args?: {
    userBan: UserBanRow
    userProfile?: UserRow
    issuerUserProfile?: UserRow
    revokerUserProfile?: UserRow | null
  }): UserBan | undefined {
    if (!args) {
      return undefined
    }

    const { userBan: row } = args

    return {
      id: row.id,
      userId: row.userId,
      issuedBy: row.issuedBy,
      reason: row.reason as BanReason,
      comment: row.comment,
      createdAt: row.createdAt,
      revokedAt: row.revokedAt,
      expiresAt: row.expiresAt,
      revokedBy: row.revokedBy,
      userProfile: this.convertUserToInterface(args.userProfile),
      issuerUserProfile: this.convertUserToInterface(args.issuerUserProfile),
      revokerUserProfile: this.convertUserToInterface(args.revokerUserProfile),
    }
  }

  async getList(
    args: Parameters<UserBanRepositoryInterface["getList"]>[0],
  ) {
    const dateNow = new Date()
    const statusFilters: SQL[] = []

    if (args.status?.includes("active")) {
      statusFilters.push(and(
        isNull(userBans.revokedAt),
        or(isNull(userBans.expiresAt), gt(userBans.expiresAt, dateNow)),
      ))
    }

    if (args.status?.includes("expired")) {
      statusFilters.push(and(
        isNull(userBans.revokedAt),
        lte(userBans.expiresAt, dateNow),
      ))
    }

    if (args.status?.includes("revoked")) {
      statusFilters.push(isNotNull(userBans.revokedAt))
    }

    const statusFilter = statusFilters.length ? or(...statusFilters) : undefined
    const filter = and(
      args.userId ? eq(userBans.userId, args.userId) : undefined,
      statusFilter,
    )

    const [rows, [totalCountResult]] = await Promise.all([
      this.drizzle.client
        .select({
          userBan: userBans,
          userProfile: users,
          issuerUserProfile: issuerUsers,
          revokerUserProfile: revokerUsers,
        })
        .from(userBans)
        .innerJoin(users, eq(users.id, userBans.userId))
        .innerJoin(issuerUsers, eq(issuerUsers.id, userBans.issuedBy))
        .leftJoin(revokerUsers, eq(revokerUsers.id, userBans.revokedBy))
        .where(filter)
        .orderBy(desc(userBans.createdAt))
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(userBans)
        .where(filter),
    ])

    return {
      items: rows.map(row => this.convertToInterface(row)),
      totalCount: totalCountResult?.count ?? 0,
    }
  }

  async getById(
    args: Parameters<UserBanRepositoryInterface["getById"]>[0],
  ): Promise<UserBan | undefined> {
    const [row] = await this.drizzle.client
      .select({
        userBan: userBans,
        userProfile: users,
        issuerUserProfile: issuerUsers,
        revokerUserProfile: revokerUsers,
      })
      .from(userBans)
      .innerJoin(users, eq(users.id, userBans.userId))
      .innerJoin(issuerUsers, eq(issuerUsers.id, userBans.issuedBy))
      .leftJoin(revokerUsers, eq(revokerUsers.id, userBans.revokedBy))
      .where(eq(userBans.id, args.id))
      .limit(1)

    return this.convertToInterface(row)
  }

  async getByUserId(
    args: Parameters<UserBanRepositoryInterface["getByUserId"]>[0],
  ): Promise<UserBan[]> {
    const rows = await this.drizzle.client
      .select({
        userBan: userBans,
        userProfile: users,
        issuerUserProfile: issuerUsers,
        revokerUserProfile: revokerUsers,
      })
      .from(userBans)
      .innerJoin(users, eq(users.id, userBans.userId))
      .innerJoin(issuerUsers, eq(issuerUsers.id, userBans.issuedBy))
      .leftJoin(revokerUsers, eq(revokerUsers.id, userBans.revokedBy))
      .where(eq(userBans.userId, args.userId))
      .orderBy(desc(userBans.createdAt))

    return rows.map(row => this.convertToInterface(row))
  }

  async getActiveByUserId(
    args: Parameters<UserBanRepositoryInterface["getActiveByUserId"]>[0],
  ): Promise<UserBan | undefined> {
    const [row] = await this.drizzle.client
      .select({
        userBan: userBans,
      })
      .from(userBans)
      .where(and(
        eq(userBans.userId, args.userId),
        isNull(userBans.revokedAt),
        or(
          isNull(userBans.expiresAt),
          gt(userBans.expiresAt, new Date()),
        ),
      ))
      .orderBy(desc(userBans.createdAt))
      .limit(1)

    return this.convertToInterface(row)
  }

  async create(
    args: Parameters<UserBanRepositoryInterface["create"]>[0],
  ): Promise<UserBan> {
    const [row] = await this.drizzle.client
      .insert(userBans)
      .values({
        userId: args.userId,
        issuedBy: args.issuedBy,
        reason: args.reason,
        comment: args.comment ?? null,
        expiresAt: args.expiresAt ?? null,
      })
      .returning()

    return this.getById({ id: row.id })
  }

  async revoke(
    args: Parameters<UserBanRepositoryInterface["revoke"]>[0],
  ): Promise<UserBan | undefined> {
    const [row] = await this.drizzle.client
      .update(userBans)
      .set({
        revokedAt: new Date(),
        revokedBy: args.revokedBy,
      })
      .where(eq(userBans.id, args.id))
      .returning()

    return this.getById({ id: row.id })
  }
}
