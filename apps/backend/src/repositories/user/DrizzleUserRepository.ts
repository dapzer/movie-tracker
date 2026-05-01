import { mediaListLikes, mediaLists, mediaRatings, users } from "@movie-tracker/database"
import { SignUpMethodEnum, UserMediaRatingsAccessLevelEnum, UserRoleEnum, UserType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { and, count, eq } from "drizzle-orm"
import { UserRepositoryInterface } from "@/repositories/user/UserRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

@Injectable()
export class DrizzleUserRepository implements UserRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(user?: typeof users.$inferSelect | null): UserType | null {
    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      signUpMethod: SignUpMethodEnum[user.signUpMethod],
      isEmailVerified: user.isEmailVerified,
      password: user.password,
      roles: user.roles.map(el => UserRoleEnum[el]),
      mediaRatingsAccessLevel: UserMediaRatingsAccessLevelEnum[user.mediaRatingsAccessLevel],
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async getById(id: string) {
    const [user] = await this.drizzle.client
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return this.convertToInterface(user)
  }

  async getStatsById(id: string) {
    const [[mediaListCountResult], [mediaRatingsCountResult], [mediaListLikeCountResult]] = await Promise.all([
      this.drizzle.client
        .select({ count: count() })
        .from(mediaLists)
        .where(and(
          eq(mediaLists.userId, id),
          eq(mediaLists.accessLevel, "PUBLIC"),
        )),
      this.drizzle.client
        .select({ count: count() })
        .from(mediaRatings)
        .where(eq(mediaRatings.userId, id)),
      this.drizzle.client
        .select({ count: count() })
        .from(mediaListLikes)
        .where(eq(mediaListLikes.userId, id)),
    ])

    return {
      mediaListCount: mediaListCountResult?.count ?? 0,
      mediaRatingsCount: mediaRatingsCountResult?.count ?? 0,
      mediaListLikeCount: mediaListLikeCountResult?.count ?? 0,
    }
  }

  async getByEmail(email: string) {
    const [user] = await this.drizzle.client
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return this.convertToInterface(user)
  }

  async create(args: Parameters<UserRepositoryInterface["create"]>[0]) {
    const [user] = await this.drizzle.client
      .insert(users)
      .values(args.body)
      .returning()

    return this.convertToInterface(user)
  }

  async update(args: Parameters<UserRepositoryInterface["update"]>[0]) {
    const data: Record<string, unknown> = {}

    if (args.body.name !== undefined) {
      data.name = args.body.name
    }
    if (args.body.image !== undefined) {
      data.image = args.body.image
    }
    if (args.body.isEmailVerified !== undefined) {
      data.isEmailVerified = args.body.isEmailVerified
    }
    if (args.body.password !== undefined) {
      data.password = args.body.password
    }
    if (args.body.email !== undefined) {
      data.email = args.body.email
    }
    if (args.body.mediaRatingsAccessLevel !== undefined) {
      data.mediaRatingsAccessLevel = args.body.mediaRatingsAccessLevel
    }
    if (args.body.language !== undefined) {
      data.language = args.body.language
    }

    const [user] = await this.drizzle.client
      .update(users)
      .set(data)
      .where(eq(users.id, args.id))
      .returning()

    return this.convertToInterface(user)
  }

  async delete(id: string) {
    const [user] = await this.drizzle.client
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    return this.convertToInterface(user)
  }

  async getCount() {
    const [result] = await this.drizzle.client
      .select({ count: count() })
      .from(users)

    return result?.count ?? 0
  }
}
