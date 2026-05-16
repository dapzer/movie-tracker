import { mediaReviewsModerationLogs, users } from "@movie-tracker/database"
import { eq } from "@movie-tracker/database/drizzle"
import {
  MediaReviewModerationLog,
  MediaReviewModerationLogAction,
  MediaReviewModerationLogReason,
  SignUpMethodEnum,
  UserMediaRatingsAccessLevelEnum,
  UserPublicType,
  UserRoleEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import {
  MediaReviewsModerationLogsRepositoryInterface,
} from "@/repositories/mediaReviewsModerationLogs/MediaReviewsModerationLogsRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { getPublicUser } from "@/shared/utils/getPublicUser"

type MediaReviewModerationLogRow = typeof mediaReviewsModerationLogs.$inferSelect
type UserRow = typeof users.$inferSelect

@Injectable()
export class DrizzleMediaReviewsModerationLogsRepository implements MediaReviewsModerationLogsRepositoryInterface {
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
    moderationLog: MediaReviewModerationLogRow
    moderator?: UserRow | null
  }): MediaReviewModerationLog | undefined {
    if (!args) {
      return undefined
    }

    const { moderationLog: row } = args

    return {
      id: row.id,
      mediaReviewId: row.mediaReviewId,
      moderator: this.convertUserToInterface(args.moderator),
      action: MediaReviewModerationLogAction[row.action as keyof typeof MediaReviewModerationLogAction],
      reason: row.reason
        ? MediaReviewModerationLogReason[row.reason as keyof typeof MediaReviewModerationLogReason]
        : undefined,
      comment: row.comment,
      createdAt: row.createdAt,
    }
  }

  async getById(
    args: Parameters<MediaReviewsModerationLogsRepositoryInterface["getById"]>[0],
  ): Promise<MediaReviewModerationLog | undefined> {
    const [row] = await this.drizzle.client
      .select({
        moderationLog: mediaReviewsModerationLogs,
        moderator: users,
      })
      .from(mediaReviewsModerationLogs)
      .leftJoin(users, eq(users.id, mediaReviewsModerationLogs.moderatorId))
      .where(eq(mediaReviewsModerationLogs.id, args.id))
      .limit(1)

    return this.convertToInterface(row)
  }

  async getByReviewId(
    args: Parameters<MediaReviewsModerationLogsRepositoryInterface["getByReviewId"]>[0],
  ): Promise<MediaReviewModerationLog[]> {
    const rows = await this.drizzle.client
      .select({
        moderationLog: mediaReviewsModerationLogs,
        moderator: users,
      })
      .from(mediaReviewsModerationLogs)
      .leftJoin(users, eq(users.id, mediaReviewsModerationLogs.moderatorId))
      .where(eq(mediaReviewsModerationLogs.mediaReviewId, args.mediaReviewId))

    return rows.map(el => this.convertToInterface({
      moderationLog: el.moderationLog,
      moderator: el.moderator,
    }))
  }

  async create(
    args: Parameters<MediaReviewsModerationLogsRepositoryInterface["create"]>[0],
  ): Promise<MediaReviewModerationLog> {
    const [row] = await this.drizzle.client
      .insert(mediaReviewsModerationLogs)
      .values({
        mediaReviewId: args.mediaReviewId,
        moderatorId: args.moderatorId,
        action: args.action,
        reason: args.reason ?? null,
        comment: args.comment ?? null,
        createdAt: new Date(),
      })
      .returning()

    return this.getById({ id: row.id })
  }
}
