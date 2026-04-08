import {
  mediaDetails,
  mediaRatings,
  mediaReviewDislikes,
  mediaReviewLikes,
  mediaReviews,
  users,
} from "@movie-tracker/database"
import { and, eq } from "@movie-tracker/database/drizzle"
import {
  MediaDetailsInfoType,
  MediaDetailsType,
  MediaReview,
  MediaReviewCreateBodyType,
  MediaReviewPaginatedType,
  MediaReviewRemoveReason,
  MediaReviewStatus,
  MediaTypeEnum,
  SignUpMethodEnum,
  UserMediaRatingsAccessLevelEnum,
  UserPublicType,
  UserRoleEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { count, sql } from "drizzle-orm"
import { MediaReviewRepositoryInterface } from "@/repositories/mediaReview/MediaReviewRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { getPublicUser } from "@/shared/utils/getPublicUser"

type MediaReviewRow = typeof mediaReviews.$inferSelect
type MediaDetailsRow = typeof mediaDetails.$inferSelect
type UserRow = typeof users.$inferSelect
type MediaRatingsRow = typeof mediaRatings.$inferSelect

@Injectable()
export class DrizzleMediaReviewRepository implements MediaReviewRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertUserToInterface(user?: UserRow | null): UserPublicType | undefined {
    if (!user) {
      return undefined
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

  private convertMediaDetailsToInterface(data?: MediaDetailsRow | null): MediaDetailsType | undefined {
    if (!data) {
      return undefined
    }

    return {
      id: data.id,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase() as keyof typeof MediaTypeEnum],
      score: data.score ? Number(data.score) : 0,
      en: data.en as unknown as MediaDetailsInfoType,
      ru: data.ru as unknown as MediaDetailsInfoType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  private convertToInterface(args: {
    mediaReview: MediaReviewRow
    user?: UserRow | null
    mediaDetails?: MediaDetailsRow | null
    mediaRating?: MediaRatingsRow | null
    likesCount?: number
    dislikesCount?: number
    likeId?: string | null
    dislikeId?: string | null
  }): MediaReview {
    const { mediaReview: row } = args

    return {
      id: row.id,
      userId: row.userId,
      user: this.convertUserToInterface(args.user),
      mediaId: row.mediaId,
      mediaType: MediaTypeEnum[row.mediaType.toUpperCase() as keyof typeof MediaTypeEnum],
      mediaDetailsId: row.mediaDetailsId ?? "",
      mediaDetails: this.convertMediaDetailsToInterface(args.mediaDetails),
      title: row.title,
      content: row.content,
      isSpoiler: row.isSpoiler,
      status: MediaReviewStatus[row.status as keyof typeof MediaReviewStatus],
      publishedAt: row.publishedAt ?? undefined,
      removeReason: row.removeReason
        ? MediaReviewRemoveReason[row.removeReason as keyof typeof MediaReviewRemoveReason]
        : undefined,
      removedAt: row.removedAt ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      likesCount: args.likesCount,
      dislikesCount: args.dislikesCount,
      likeId: args.likeId ?? undefined,
      dislikeId: args.dislikeId ?? undefined,
      rating: args.mediaRating?.rating,
    }
  }

  async getById(
    args: Parameters<MediaReviewRepositoryInterface["getById"]>[0],
  ): Promise<MediaReview | undefined> {
    const likesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewLikes)
      .where(eq(mediaReviewLikes.mediaReviewId, mediaReviews.id))

    const dislikesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewDislikes)
      .where(eq(mediaReviewDislikes.mediaReviewId, mediaReviews.id))

    const [row] = await this.drizzle.client
      .select({
        mediaReview: mediaReviews,
        user: users,
        mediaDetails,
        mediaRating: mediaRatings,
        likesCount: sql<number>`(${likesSubquery})`,
        dislikesCount: sql<number>`(${dislikesSubquery})`,
        likeId: args.currentUserId
          ? sql<string | null>`(
              SELECT id FROM ${mediaReviewLikes}
              WHERE ${mediaReviewLikes.mediaReviewId} = ${mediaReviews.id}
              AND ${mediaReviewLikes.userId} = ${args.currentUserId}
              LIMIT 1
            )`
          : sql<string | null>`NULL`,
        dislikeId: args.currentUserId
          ? sql<string | null>`(
              SELECT id FROM ${mediaReviewDislikes}
              WHERE ${mediaReviewDislikes.mediaReviewId} = ${mediaReviews.id}
              AND ${mediaReviewDislikes.userId} = ${args.currentUserId}
              LIMIT 1
            )`
          : sql<string | null>`NULL`,
      })
      .from(mediaReviews)
      .leftJoin(users, eq(users.id, mediaReviews.userId))
      .leftJoin(mediaDetails, eq(mediaDetails.id, mediaReviews.mediaDetailsId))
      .leftJoin(mediaRatings, and(
        eq(mediaRatings.userId, mediaReviews.userId),
        eq(mediaRatings.mediaId, mediaReviews.mediaId),
      ))
      .where(eq(mediaReviews.id, args.id))
      .limit(1)

    return row
      ? this.convertToInterface({
          mediaReview: row.mediaReview,
          user: row.user,
          mediaDetails: row.mediaDetails,
          mediaRating: row.mediaRating,
          likesCount: row.likesCount,
          dislikesCount: row.dislikesCount,
          likeId: row.likeId,
          dislikeId: row.dislikeId,
        })
      : undefined
  }

  async getByUserIdAndMediaId(
    args: Parameters<MediaReviewRepositoryInterface["getByUserIdAndMediaId"]>[0],
  ): Promise<MediaReview | undefined> {
    const likesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewLikes)
      .where(eq(mediaReviewLikes.mediaReviewId, mediaReviews.id))

    const dislikesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewDislikes)
      .where(eq(mediaReviewDislikes.mediaReviewId, mediaReviews.id))

    const [row] = await this.drizzle.client
      .select({
        mediaReview: mediaReviews,
        user: users,
        mediaRating: mediaRatings,
        likesCount: sql<number>`(${likesSubquery})`,
        dislikesCount: sql<number>`(${dislikesSubquery})`,
        likeId: args.currentUserId
          ? sql<string | null>`(
              SELECT id FROM ${mediaReviewLikes}
              WHERE ${mediaReviewLikes.mediaReviewId} = ${mediaReviews.id}
              AND ${mediaReviewLikes.userId} = ${args.currentUserId}
              LIMIT 1
            )`
          : sql<string | null>`NULL`,
        dislikeId: args.currentUserId
          ? sql<string | null>`(
              SELECT id FROM ${mediaReviewDislikes}
              WHERE ${mediaReviewDislikes.mediaReviewId} = ${mediaReviews.id}
              AND ${mediaReviewDislikes.userId} = ${args.currentUserId}
              LIMIT 1
            )`
          : sql<string | null>`NULL`,
      })
      .from(mediaReviews)
      .leftJoin(users, eq(users.id, mediaReviews.userId))
      .leftJoin(mediaRatings, and(
        eq(mediaRatings.userId, mediaReviews.userId),
        eq(mediaRatings.mediaId, mediaReviews.mediaId),
      ))
      .where(
        and(
          eq(mediaReviews.userId, args.userId),
          eq(mediaReviews.mediaId, args.mediaId),
        ),
      )
      .limit(1)

    return row
      ? this.convertToInterface({
          mediaReview: row.mediaReview,
          user: row.user,
          mediaRating: row.mediaRating,
          likesCount: row.likesCount,
          dislikesCount: row.dislikesCount,
          likeId: row.likeId,
          dislikeId: row.dislikeId,
        })
      : undefined
  }

  async getByMediaId(
    args: Parameters<MediaReviewRepositoryInterface["getByMediaId"]>[0],
  ): Promise<MediaReviewPaginatedType> {
    const likesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewLikes)
      .where(eq(mediaReviewLikes.mediaReviewId, mediaReviews.id))

    const dislikesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewDislikes)
      .where(eq(mediaReviewDislikes.mediaReviewId, mediaReviews.id))

    const [items, totalCount] = await Promise.all([
      this.drizzle.client
        .select({
          mediaReview: mediaReviews,
          user: users,
          mediaRating: mediaRatings,
          likesCount: sql<number>`(${likesSubquery})`,
          dislikesCount: sql<number>`(${dislikesSubquery})`,
          likeId: args.currentUserId
            ? sql<string | null>`(
                SELECT id FROM ${mediaReviewLikes}
                WHERE ${mediaReviewLikes.mediaReviewId} = ${mediaReviews.id}
                AND ${mediaReviewLikes.userId} = ${args.currentUserId}
                LIMIT 1
              )`
            : sql<string | null>`NULL`,
          dislikeId: args.currentUserId
            ? sql<string | null>`(
                SELECT id FROM ${mediaReviewDislikes}
                WHERE ${mediaReviewDislikes.mediaReviewId} = ${mediaReviews.id}
                AND ${mediaReviewDislikes.userId} = ${args.currentUserId}
                LIMIT 1
              )`
            : sql<string | null>`NULL`,
        })
        .from(mediaReviews)
        .leftJoin(users, eq(users.id, mediaReviews.userId))
        .leftJoin(mediaRatings, and(
          eq(mediaRatings.userId, mediaReviews.userId),
          eq(mediaRatings.mediaId, mediaReviews.mediaId),
        ))
        .where(and(eq(mediaReviews.mediaId, args.mediaId), eq(mediaReviews.status, args.status || MediaReviewStatus.PUBLISHED)))
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(mediaReviews)
        .where(and(eq(mediaReviews.mediaId, args.mediaId), eq(mediaReviews.status, args.status || MediaReviewStatus.PUBLISHED))),
    ])

    return {
      items: items.map(item => this.convertToInterface({
        mediaReview: item.mediaReview,
        user: item.user,
        mediaRating: item.mediaRating,
        likesCount: Number(item.likesCount),
        dislikesCount: Number(item.dislikesCount),
        likeId: item.likeId,
        dislikeId: item.dislikeId,
      })),
      totalCount: totalCount[0]?.count ?? 0,
    }
  }

  async getList(
    args: Parameters<MediaReviewRepositoryInterface["getList"]>[0],
  ): Promise<MediaReviewPaginatedType> {
    const likesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewLikes)
      .where(eq(mediaReviewLikes.mediaReviewId, mediaReviews.id))

    const dislikesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewDislikes)
      .where(eq(mediaReviewDislikes.mediaReviewId, mediaReviews.id))

    const statusFilter = eq(mediaReviews.status, args.status || MediaReviewStatus.PUBLISHED)

    const [items, totalCount] = await Promise.all([
      this.drizzle.client
        .select({
          mediaReview: mediaReviews,
          user: users,
          mediaDetails,
          mediaRating: mediaRatings,
          likesCount: sql<number>`(${likesSubquery})`,
          dislikesCount: sql<number>`(${dislikesSubquery})`,
          likeId: args.currentUserId
            ? sql<string | null>`(
                SELECT id FROM ${mediaReviewLikes}
                WHERE ${mediaReviewLikes.mediaReviewId} = ${mediaReviews.id}
                AND ${mediaReviewLikes.userId} = ${args.currentUserId}
                LIMIT 1
              )`
            : sql<string | null>`NULL`,
          dislikeId: args.currentUserId
            ? sql<string | null>`(
                SELECT id FROM ${mediaReviewDislikes}
                WHERE ${mediaReviewDislikes.mediaReviewId} = ${mediaReviews.id}
                AND ${mediaReviewDislikes.userId} = ${args.currentUserId}
                LIMIT 1
              )`
            : sql<string | null>`NULL`,
        })
        .from(mediaReviews)
        .leftJoin(users, eq(users.id, mediaReviews.userId))
        .leftJoin(mediaDetails, eq(mediaDetails.id, mediaReviews.mediaDetailsId))
        .leftJoin(mediaRatings, and(
          eq(mediaRatings.userId, mediaReviews.userId),
          eq(mediaRatings.mediaId, mediaReviews.mediaId),
        ))
        .where(statusFilter)
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(mediaReviews)
        .where(statusFilter),
    ])

    return {
      items: items.map(item => this.convertToInterface({
        mediaReview: item.mediaReview,
        user: item.user,
        mediaDetails: item.mediaDetails,
        mediaRating: item.mediaRating,
        likesCount: Number(item.likesCount),
        dislikesCount: Number(item.dislikesCount),
        likeId: item.likeId,
        dislikeId: item.dislikeId,
      })),
      totalCount: totalCount[0]?.count ?? 0,
    }
  }

  async create(
    args: Parameters<MediaReviewRepositoryInterface["create"]>[0],
  ): Promise<MediaReview> {
    const [mediaReview] = await this.drizzle.client
      .insert(mediaReviews)
      .values({
        userId: args.userId,
        mediaId: args.mediaId,
        mediaType: args.mediaType as MediaReviewCreateBodyType["mediaType"],
        mediaDetailsId: args.mediaDetailsId,
        title: args.title,
        content: args.content,
        isSpoiler: args.isSpoiler,
        status: args.status,
      })
      .returning()

    return this.convertToInterface({ mediaReview })
  }

  async getByUserId(
    args: Parameters<MediaReviewRepositoryInterface["getByUserId"]>[0],
  ): Promise<MediaReviewPaginatedType> {
    const likesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewLikes)
      .where(eq(mediaReviewLikes.mediaReviewId, mediaReviews.id))

    const dislikesSubquery = this.drizzle.client
      .select({ count: count() })
      .from(mediaReviewDislikes)
      .where(eq(mediaReviewDislikes.mediaReviewId, mediaReviews.id))

    const [items, totalCount] = await Promise.all([
      this.drizzle.client
        .select({
          mediaReview: mediaReviews,
          user: users,
          mediaDetails,
          mediaRating: mediaRatings,
          likesCount: sql<number>`(${likesSubquery})`,
          dislikesCount: sql<number>`(${dislikesSubquery})`,
          likeId: args.currentUserId
            ? sql<string | null>`(
                SELECT id FROM ${mediaReviewLikes}
                WHERE ${mediaReviewLikes.mediaReviewId} = ${mediaReviews.id}
                AND ${mediaReviewLikes.userId} = ${args.currentUserId}
                LIMIT 1
              )`
            : sql<string | null>`NULL`,
          dislikeId: args.currentUserId
            ? sql<string | null>`(
                SELECT id FROM ${mediaReviewDislikes}
                WHERE ${mediaReviewDislikes.mediaReviewId} = ${mediaReviews.id}
                AND ${mediaReviewDislikes.userId} = ${args.currentUserId}
                LIMIT 1
              )`
            : sql<string | null>`NULL`,
        })
        .from(mediaReviews)
        .leftJoin(users, eq(users.id, mediaReviews.userId))
        .leftJoin(mediaDetails, eq(mediaDetails.id, mediaReviews.mediaDetailsId))
        .leftJoin(mediaRatings, and(
          eq(mediaRatings.userId, mediaReviews.userId),
          eq(mediaRatings.mediaId, mediaReviews.mediaId),
        ))
        .where(and(eq(mediaReviews.userId, args.userId), eq(mediaReviews.status, args.status || MediaReviewStatus.PUBLISHED)))
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(mediaReviews)
        .where(and(eq(mediaReviews.userId, args.userId), eq(mediaReviews.status, args.status || MediaReviewStatus.PUBLISHED))),
    ])

    return {
      items: items.map(item => this.convertToInterface({
        mediaReview: item.mediaReview,
        user: item.user,
        mediaDetails: item.mediaDetails,
        mediaRating: item.mediaRating,
        likesCount: Number(item.likesCount),
        dislikesCount: Number(item.dislikesCount),
        likeId: item.likeId,
        dislikeId: item.dislikeId,
      })),
      totalCount: totalCount[0]?.count ?? 0,
    }
  }

  async update(
    args: Parameters<MediaReviewRepositoryInterface["update"]>[0],
  ): Promise<MediaReview> {
    const [mediaReview] = await this.drizzle.client
      .update(mediaReviews)
      .set({
        isSpoiler: args.isSpoiler,
        status: args.status,
        publishedAt: args.publishedAt,
        removeReason: args.removeReason,
        removedAt: args.removedAt,
      })
      .where(eq(mediaReviews.id, args.id))
      .returning()

    return this.convertToInterface({ mediaReview })
  }

  async delete(id: string): Promise<MediaReview> {
    const [mediaReview] = await this.drizzle.client
      .delete(mediaReviews)
      .where(eq(mediaReviews.id, id))
      .returning()

    return this.convertToInterface({ mediaReview })
  }

  async getCount(): Promise<number> {
    const [result] = await this.drizzle.client
      .select({ count: count() })
      .from(mediaReviews)

    return result?.count ?? 0
  }
}
