import { mediaDetails, mediaRatings, users } from "@movie-tracker/database"
import { and, desc, eq, inArray } from "@movie-tracker/database/drizzle"
import {
  MediaDetailsInfoType,
  MediaRatingType,
  MediaTypeEnum,
  SignUpMethodEnum,
  UserMediaRatingsAccessLevelEnum,
  UserPublicType,
  UserRoleEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { count } from "drizzle-orm"
import { MediaRatingRepositoryInterface } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { getPublicUser } from "@/shared/utils/getPublicUser"

type MediaRatingRow = typeof mediaRatings.$inferSelect
type MediaDetailsRow = typeof mediaDetails.$inferSelect
type UserRow = typeof users.$inferSelect

@Injectable()
export class DrizzleMediaRatingRepository implements MediaRatingRepositoryInterface {
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
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

  private convertMediaDetails(data?: MediaDetailsRow | null) {
    if (!data) {
      return undefined
    }

    let enMediaDetails: Omit<MediaDetailsInfoType, "seasons"> | undefined
    let ruMediaDetails: Omit<MediaDetailsInfoType, "seasons"> | undefined

    if (data.en) {
      const { seasons: _, ...rest } = data.en
      enMediaDetails = rest
    }

    if (data.ru) {
      const { seasons: _, ...rest } = data.ru
      ruMediaDetails = rest
    }

    return {
      id: data.id,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase()],
      mediaId: data.mediaId,
      score: data.score ? Number(data.score) : 0,
      ru: ruMediaDetails,
      en: enMediaDetails,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  private convertMediaRatingToInterface(args: {
    mediaRating: MediaRatingRow
    mediaDetails?: MediaDetailsRow | null
    user?: UserRow | null
  }): MediaRatingType {
    return {
      id: args.mediaRating.id,
      userId: args.mediaRating.userId,
      mediaId: args.mediaRating.mediaId,
      mediaType: MediaTypeEnum[args.mediaRating.mediaType.toUpperCase()],
      mediaDetailsId: args.mediaRating.mediaDetailsId,
      user: this.convertUserToInterface(args.user),
      mediaDetails: this.convertMediaDetails(args.mediaDetails),
      rating: args.mediaRating.rating,
      createdAt: args.mediaRating.createdAt,
      updatedAt: args.mediaRating.updatedAt,
    }
  }

  async getAll() {
    const rows = await this.drizzle.client
      .select({ mediaRating: mediaRatings })
      .from(mediaRatings)

    return rows.map(row => this.convertMediaRatingToInterface({
      mediaRating: row.mediaRating,
    }))
  }

  async getRecentlyCreated(
    args: Parameters<MediaRatingRepositoryInterface["getRecentlyCreated"]>[0],
  ) {
    const [items, totalCount] = await Promise.all([
      this.drizzle.client
        .select({ mediaRating: mediaRatings, mediaDetails, user: users })
        .from(mediaRatings)
        .innerJoin(users, eq(users.id, mediaRatings.userId))
        .leftJoin(mediaDetails, eq(mediaDetails.id, mediaRatings.mediaDetailsId))
        .where(eq(users.mediaRatingsAccessLevel, UserMediaRatingsAccessLevelEnum.PUBLIC))
        .orderBy(desc(mediaRatings.createdAt))
        .limit(args.limit)
        .offset(args.offset),
      this.getCount(),
    ])

    return {
      items: items.map(item => this.convertMediaRatingToInterface({
        mediaRating: item.mediaRating,
        mediaDetails: item.mediaDetails,
        user: item.user,
      })),
      totalCount,
    }
  }

  async getById(args: Parameters<MediaRatingRepositoryInterface["getById"]>[0]) {
    const [row] = await this.drizzle.client
      .select({ mediaRating: mediaRatings })
      .from(mediaRatings)
      .where(eq(mediaRatings.id, args.id))
      .limit(1)

    return row
      ? this.convertMediaRatingToInterface({ mediaRating: row.mediaRating })
      : undefined
  }

  async getByUserIdAndMediaId(
    args: Parameters<MediaRatingRepositoryInterface["getByUserIdAndMediaId"]>[0],
  ) {
    const [row] = await this.drizzle.client
      .select({ mediaRating: mediaRatings })
      .from(mediaRatings)
      .where(
        and(
          eq(mediaRatings.userId, args.userId),
          eq(mediaRatings.mediaId, args.mediaId),
        ),
      )
      .limit(1)

    return row
      ? this.convertMediaRatingToInterface({ mediaRating: row.mediaRating })
      : undefined
  }

  async getByUserId(args: Parameters<MediaRatingRepositoryInterface["getByUserId"]>[0]) {
    const [items, totalCount] = await Promise.all([
      this.drizzle.client
        .select({ mediaRating: mediaRatings, mediaDetails })
        .from(mediaRatings)
        .leftJoin(mediaDetails, eq(mediaDetails.id, mediaRatings.mediaDetailsId))
        .where(eq(mediaRatings.userId, args.userId))
        .orderBy(desc(mediaRatings.createdAt))
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(mediaRatings)
        .where(eq(mediaRatings.userId, args.userId)),
    ])

    return {
      items: items.map(item => this.convertMediaRatingToInterface({
        mediaRating: item.mediaRating,
        mediaDetails: item.mediaDetails,
      })),
      totalCount: Number(totalCount[0]?.count ?? 0),
    }
  }

  async getByUserIdAndMediaIds(
    args: Parameters<MediaRatingRepositoryInterface["getByUserIdAndMediaIds"]>[0],
  ) {
    if (!args.mediaIds.length) {
      return []
    }

    const rows = await this.drizzle.client
      .select({ mediaRating: mediaRatings })
      .from(mediaRatings)
      .where(
        and(
          eq(mediaRatings.userId, args.userId),
          inArray(mediaRatings.mediaId, args.mediaIds),
        ),
      )

    return rows.map(row => this.convertMediaRatingToInterface({
      mediaRating: row.mediaRating,
    }))
  }

  async create(args: Parameters<MediaRatingRepositoryInterface["create"]>[0]) {
    const [mediaRating] = await this.drizzle.client
      .insert(mediaRatings)
      .values({
        userId: args.userId,
        mediaDetailsId: args.mediaDetailsId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        rating: args.rating,
      })
      .returning()

    return this.convertMediaRatingToInterface({ mediaRating })
  }

  async update(args: Parameters<MediaRatingRepositoryInterface["update"]>[0]) {
    const [mediaRating] = await this.drizzle.client
      .update(mediaRatings)
      .set({ rating: args.rating })
      .where(eq(mediaRatings.id, args.id))
      .returning()

    return this.convertMediaRatingToInterface({ mediaRating })
  }

  async delete(id: string) {
    const [mediaRating] = await this.drizzle.client
      .delete(mediaRatings)
      .where(eq(mediaRatings.id, id))
      .returning()

    return this.convertMediaRatingToInterface({ mediaRating })
  }

  async getCount() {
    const [result] = await this.drizzle.client
      .select({ count: count() })
      .from(mediaRatings)

    return result?.count ?? 0
  }
}
