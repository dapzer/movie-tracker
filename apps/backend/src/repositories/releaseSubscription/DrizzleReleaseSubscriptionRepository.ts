import { mediaDetails, releaseSubscriptions } from "@movie-tracker/database"
import { and, desc, eq, inArray, sql } from "@movie-tracker/database/drizzle"
import {
  MediaDetailsInfoType,
  MediaDetailsType,
  MediaTypeEnum,
  ReleaseSubscriptionsResponseType,
  ReleaseSubscriptionType,
  ReleaseSubscriptionWithDetailsType,
  SortOrderEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { asc, count, isNotNull, isNull, or } from "drizzle-orm"
import {
  ReleaseSubscriptionRepositoryInterface,
} from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type ReleaseSubscriptionRow = typeof releaseSubscriptions.$inferSelect
type MediaDetailsRow = typeof mediaDetails.$inferSelect

@Injectable()
export class DrizzleReleaseSubscriptionRepository implements ReleaseSubscriptionRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertMediaDetailsToInterface(data: MediaDetailsRow): MediaDetailsType {
    return {
      id: data.id,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase()],
      score: data.score ? Number(data.score) : 0,
      en: data.en as unknown as MediaDetailsInfoType,
      ru: data.ru as unknown as MediaDetailsInfoType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  private convertToInterface(args: {
    releaseSubscription: ReleaseSubscriptionRow
    mediaDetails?: MediaDetailsRow | null
  }): ReleaseSubscriptionType | ReleaseSubscriptionWithDetailsType {
    const record: ReleaseSubscriptionType = {
      id: args.releaseSubscription.id,
      mediaDetailsId: args.releaseSubscription.mediaDetailsId,
      mediaId: args.releaseSubscription.mediaId,
      mediaType: MediaTypeEnum[args.releaseSubscription.mediaType.toUpperCase()],
      userId: args.releaseSubscription.userId,
      lastReleasedAt: args.releaseSubscription.lastReleasedAt,
      completedAt: args.releaseSubscription.completedAt,
      createdAt: args.releaseSubscription.createdAt,
    }

    if (args.mediaDetails) {
      return {
        ...record,
        mediaDetails: this.convertMediaDetailsToInterface(args.mediaDetails),
      }
    }

    return record
  }

  private getSearchCondition(search?: string) {
    if (!search) {
      return undefined
    }

    const pattern = `%${search}%`

    return or(
      sql`(${mediaDetails.en} ->> 'title') ILIKE ${pattern}`,
      sql`(${mediaDetails.ru} ->> 'title') ILIKE ${pattern}`,
    )
  }

  private getOrderDirection(sortDirection?: SortOrderEnum) {
    return sortDirection === SortOrderEnum.ASC ? asc : desc
  }

  async create(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["create"]>[0],
  ) {
    const [releaseSubscription] = await this.drizzle.client
      .insert(releaseSubscriptions)
      .values({
        userId: args.userId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        mediaDetailsId: args.mediaDetailsId,
      })
      .returning()

    return this.convertToInterface({ releaseSubscription })
  }

  async getById(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getById"]>[0],
  ) {
    const [row] = await this.drizzle.client
      .select({ releaseSubscription: releaseSubscriptions })
      .from(releaseSubscriptions)
      .where(eq(releaseSubscriptions.id, args.id))
      .limit(1)

    return row
      ? this.convertToInterface({ releaseSubscription: row.releaseSubscription })
      : undefined
  }

  async getByMediaDetailsId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getByMediaDetailsId"]>[0],
  ) {
    const rows = await this.drizzle.client
      .select({ releaseSubscription: releaseSubscriptions })
      .from(releaseSubscriptions)
      .where(eq(releaseSubscriptions.mediaDetailsId, args.mediaDetailsId))

    return rows.map(row => this.convertToInterface({
      releaseSubscription: row.releaseSubscription,
    }))
  }

  async getUncompletedByMediaDetailsId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getUncompletedByMediaDetailsId"]>[0],
  ) {
    const rows = await this.drizzle.client
      .select({ releaseSubscription: releaseSubscriptions })
      .from(releaseSubscriptions)
      .where(and(
        eq(releaseSubscriptions.mediaDetailsId, args.mediaDetailsId),
        eq(releaseSubscriptions.completedAt, null),
      ))

    return rows.map(row => this.convertToInterface({
      releaseSubscription: row.releaseSubscription,
    }))
  }

  async getByUserId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getByUserId"]>[0],
  ): Promise<ReleaseSubscriptionsResponseType> {
    const search = args.search?.trim()
    const sortBy = args.sortBy ?? "createdAt"
    const sortDirection = args.sortDirection ?? SortOrderEnum.DESC
    const hasFilters = Boolean(search) || typeof args.completed === "boolean" || Boolean(args.mediaType)
    const searchCondition = this.getSearchCondition(search)
    const conditions = [eq(releaseSubscriptions.userId, args.userId)]

    if (searchCondition) {
      conditions.push(searchCondition)
    }
    if (args.mediaType) {
      conditions.push(eq(releaseSubscriptions.mediaType, args.mediaType))
    }
    if (args.completed === true) {
      conditions.push(isNotNull(releaseSubscriptions.completedAt))
    }
    if (args.completed === false) {
      conditions.push(isNull(releaseSubscriptions.completedAt))
    }

    const orderDirection = this.getOrderDirection(sortDirection)

    const [items, totalCountResult, totalSubscriptionsCountResult] = await Promise.all([
      this.drizzle.client
        .select({ releaseSubscription: releaseSubscriptions, mediaDetails })
        .from(releaseSubscriptions)
        .leftJoin(mediaDetails, eq(mediaDetails.id, releaseSubscriptions.mediaDetailsId))
        .where(and(...conditions))
        .orderBy(orderDirection(releaseSubscriptions[sortBy]))
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(releaseSubscriptions)
        .leftJoin(mediaDetails, eq(mediaDetails.id, releaseSubscriptions.mediaDetailsId))
        .where(and(...conditions)),
      hasFilters
        ? this.drizzle.client
            .select({ count: count() })
            .from(releaseSubscriptions)
            .where(eq(releaseSubscriptions.userId, args.userId))
        : Promise.resolve([{ count: 0 }]),
    ])

    return {
      items: items.map(item => this.convertToInterface({
        releaseSubscription: item.releaseSubscription,
        mediaDetails: item.mediaDetails,
      }) as ReleaseSubscriptionWithDetailsType),
      totalCount: totalCountResult[0]?.count ?? 0,
      totalSubscriptionsCount: hasFilters
        ? totalSubscriptionsCountResult[0]?.count ?? 0
        : totalCountResult[0]?.count ?? 0,
    }
  }

  async getAllByUserId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getAllByUserId"]>[0],
  ) {
    const rows = await this.drizzle.client
      .select({ releaseSubscription: releaseSubscriptions })
      .from(releaseSubscriptions)
      .where(eq(releaseSubscriptions.userId, args.userId))

    return rows.map(row => this.convertToInterface({
      releaseSubscription: row.releaseSubscription,
    }))
  }

  async getByMediaIdUserId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getByMediaIdUserId"]>[0],
  ) {
    const [row] = await this.drizzle.client
      .select({ releaseSubscription: releaseSubscriptions })
      .from(releaseSubscriptions)
      .where(and(
        eq(releaseSubscriptions.mediaId, args.mediaId),
        eq(releaseSubscriptions.userId, args.userId),
      ))
      .limit(1)

    return row
      ? this.convertToInterface({ releaseSubscription: row.releaseSubscription })
      : undefined
  }

  async getAll() {
    const rows = await this.drizzle.client
      .select({ releaseSubscription: releaseSubscriptions })
      .from(releaseSubscriptions)

    return rows.map(row => this.convertToInterface({
      releaseSubscription: row.releaseSubscription,
    }))
  }

  async update(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["update"]>[0],
  ) {
    const [releaseSubscription] = await this.drizzle.client
      .update(releaseSubscriptions)
      .set({
        completedAt: args.completedAt,
        lastReleasedAt: args.lastReleasedAt,
      })
      .where(eq(releaseSubscriptions.id, args.id))
      .returning()

    return this.convertToInterface({ releaseSubscription })
  }

  async updateManyByIds(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["updateManyByIds"]>[0],
  ) {
    if (!args.ids.length) {
      return []
    }

    const rows = await this.drizzle.client
      .update(releaseSubscriptions)
      .set({
        completedAt: args.completedAt,
        lastReleasedAt: args.lastReleasedAt,
      })
      .where(inArray(releaseSubscriptions.id, args.ids))
      .returning()

    return rows.map(row => this.convertToInterface({
      releaseSubscription: row,
    }))
  }

  async delete(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["delete"]>[0],
  ) {
    const [releaseSubscription] = await this.drizzle.client
      .delete(releaseSubscriptions)
      .where(eq(releaseSubscriptions.id, args.id))
      .returning()

    return this.convertToInterface({ releaseSubscription })
  }
}
