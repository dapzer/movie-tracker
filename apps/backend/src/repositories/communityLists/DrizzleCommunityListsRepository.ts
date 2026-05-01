import { mediaDetails, mediaItems, mediaListLikes, mediaLists, mediaListViews, users } from "@movie-tracker/database"
import { and, desc, eq, inArray, sql } from "@movie-tracker/database/drizzle"
import {
  MediaListAccessLevelEnum,
  MediaListPosterType,
  MediaListType,
  SignUpMethodEnum,
  SortOrderEnum,
  UserMediaRatingsAccessLevelEnum,
  UserPublicType,
  UserRoleEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { asc, count, or, SQL } from "drizzle-orm"
import { CommunityListsRepositoryInterface } from "@/repositories/communityLists/CommunityListsRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { getPublicUser } from "@/shared/utils/getPublicUser"

type MediaListRow = typeof mediaLists.$inferSelect
type UserRow = typeof users.$inferSelect

@Injectable()
export class DrizzleCommunityListsRepository implements CommunityListsRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {
  }

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

  private convertToInterface(args: {
    mediaList: MediaListRow
    user?: UserRow | null
    extras?: {
      likesCount?: number
      mediaItemsCount?: number
      isLiked?: boolean
      poster?: MediaListPosterType
    }
  }): MediaListType {
    return {
      id: args.mediaList.id,
      humanFriendlyId: args.mediaList.humanFriendlyId,
      userId: args.mediaList.userId,
      user: args.user
        ? this.convertUserToInterface(args.user)
        : undefined,
      isSystem: args.mediaList.isSystem,
      accessLevel: MediaListAccessLevelEnum[args.mediaList.accessLevel],
      title: args.mediaList.title,
      description: args.mediaList.description,
      likesCount: args.extras?.likesCount,
      mediaItemsCount: args.extras?.mediaItemsCount,
      isLiked: Boolean(args.extras?.isLiked),
      poster: args.extras?.poster,
      createdAt: args.mediaList.createdAt,
      updatedAt: args.mediaList.updatedAt,
    }
  }

  private getTitleCondition(title?: string): SQL | undefined {
    const normalizedTitle = title?.trim().toLowerCase()
    if (!normalizedTitle) {
      return undefined
    }

    const favoriteListTitles = ["избранное", "favorites"]
    const conditions: SQL[] = [sql`lower(${mediaLists.title}) like ${`%${normalizedTitle}%`}`]

    if (favoriteListTitles.some(value => value.includes(normalizedTitle))) {
      conditions.push(sql`${mediaLists.title} is null`)
    }

    return conditions.length === 1 ? conditions[0] : or(...conditions)
  }

  private getOrderDirection(sortDirection?: SortOrderEnum) {
    return sortDirection === SortOrderEnum.ASC ? asc : desc
  }

  private async getMediaItemsCountByListIds(listIds: string[]) {
    const rows = await this.drizzle.client
      .select({ mediaListId: mediaItems.mediaListId, count: count() })
      .from(mediaItems)
      .where(inArray(mediaItems.mediaListId, listIds))
      .groupBy(mediaItems.mediaListId)

    return new Map(rows.map(row => [row.mediaListId, Number(row.count)]))
  }

  private async getLikesCountByListIds(listIds: string[]) {
    const rows = await this.drizzle.client
      .select({ mediaListId: mediaListLikes.mediaListId, count: count() })
      .from(mediaListLikes)
      .where(inArray(mediaListLikes.mediaListId, listIds))
      .groupBy(mediaListLikes.mediaListId)

    return new Map(rows.map(row => [row.mediaListId, Number(row.count)]))
  }

  private async getLikedListIds(listIds: string[], userId: string) {
    const rows = await this.drizzle.client
      .select({ mediaListId: mediaListLikes.mediaListId })
      .from(mediaListLikes)
      .where(and(
        inArray(mediaListLikes.mediaListId, listIds),
        eq(mediaListLikes.userId, userId),
      ))

    return new Set(rows.map(row => row.mediaListId))
  }

  private async getPostersByListIds(listIds: string[]) {
    const postersByListId = new Map<string, MediaListPosterType>()

    await Promise.all(listIds.map(async (listId) => {
      const rows = await this.drizzle.client
        .select({ mediaDetails })
        .from(mediaItems)
        .leftJoin(mediaDetails, eq(mediaDetails.id, mediaItems.mediaDetailsId))
        .where(eq(mediaItems.mediaListId, listId))
        .orderBy(desc(mediaItems.createdAt))
        .limit(10)

      const poster = rows.reduce<MediaListPosterType>((acc, row) => {
        acc.ru.push(row.mediaDetails?.ru?.poster)
        acc.en.push(row.mediaDetails?.en?.poster)
        return acc
      }, { en: [], ru: [] })

      postersByListId.set(listId, poster)
    }))

    return postersByListId
  }

  private async hydrateMediaLists(args: {
    rows: Array<{ mediaList: MediaListRow, user?: UserRow | null }>
    currentUserId?: string
  }) {
    if (!args.rows.length) {
      return []
    }

    const listIds = args.rows.map(row => row.mediaList.id)
    const [
      mediaItemsCountByListId,
      likesCountByListId,
      likedListIds,
      postersByListId,
    ] = await Promise.all([
      this.getMediaItemsCountByListIds(listIds),
      this.getLikesCountByListIds(listIds),
      args.currentUserId
        ? this.getLikedListIds(listIds, args.currentUserId)
        : Promise.resolve(new Set<string>()),
      this.getPostersByListIds(listIds),
    ])

    return args.rows.map(row => this.convertToInterface({
      mediaList: row.mediaList,
      user: row.user,
      extras: {
        mediaItemsCount: mediaItemsCountByListId.get(row.mediaList.id) ?? 0,
        likesCount: likesCountByListId.get(row.mediaList.id) ?? 0,
        isLiked: likedListIds.has(row.mediaList.id),
        poster: postersByListId.get(row.mediaList.id) ?? { en: [], ru: [] },
      },
    }))
  }

  private selectMediaLists(args: {
    where: SQL[]
    limit: number
    offset: number
    orderBy?: ReturnType<typeof asc> | ReturnType<typeof desc>
  }) {
    const baseQuery = this.drizzle.client
      .select({ mediaList: mediaLists, user: users })
      .from(mediaLists)
      .leftJoin(users, eq(users.id, mediaLists.userId))
      .where(and(...args.where))
      .limit(args.limit)
      .offset(args.offset)

    return args.orderBy
      ? baseQuery.orderBy(args.orderBy)
      : baseQuery
  }

  private async selectMediaListsWithCount(args: {
    itemsQuery: Promise<Array<{ mediaList: MediaListRow, user?: UserRow | null }>>
    countWhere: SQL[]
    currentUserId?: string
  }) {
    const [items, totalCountResult] = await Promise.all([
      args.itemsQuery,
      this.drizzle.client
        .select({ count: count() })
        .from(mediaLists)
        .where(and(...args.countWhere)),
    ])

    return {
      items: await this.hydrateMediaLists({
        rows: items,
        currentUserId: args.currentUserId,
      }),
      totalCount: Number(totalCountResult[0]?.count ?? 0),
    }
  }

  async getSearchResult(args: Parameters<CommunityListsRepositoryInterface["getSearchResult"]>[0]) {
    const titleCondition = this.getTitleCondition(args.title)
    const where = [
      eq(mediaLists.accessLevel, MediaListAccessLevelEnum.PUBLIC),
      ...(titleCondition ? [titleCondition] : []),
    ]

    return this.selectMediaListsWithCount({
      itemsQuery: this.selectMediaLists({
        where,
        limit: args.limit,
        offset: args.offset,
      }),
      countWhere: where,
      currentUserId: args.currentUserId,
    })
  }

  async getAllTimeTop(args: Parameters<CommunityListsRepositoryInterface["getAllTimeTop"]>[0]) {
    const titleCondition = this.getTitleCondition(args.title)
    const orderDirection = this.getOrderDirection(args.sortDirection)
    const where = [
      eq(mediaLists.accessLevel, MediaListAccessLevelEnum.PUBLIC),
      sql`exists
          (select 1 from ${mediaListLikes} where ${mediaListLikes.mediaListId} = ${mediaLists.id})`,
      sql`exists
          (select 1 from ${mediaItems} where ${mediaItems.mediaListId} = ${mediaLists.id})`,
      ...(titleCondition ? [titleCondition] : []),
    ]

    if (args.sortBy === "likes") {
      const likesCount = count(mediaListLikes.id)
      const itemsQuery = this.drizzle.client
        .select({ mediaList: mediaLists, user: users })
        .from(mediaLists)
        .leftJoin(users, eq(users.id, mediaLists.userId))
        .leftJoin(mediaListLikes, eq(mediaListLikes.mediaListId, mediaLists.id))
        .where(and(...where))
        .groupBy(mediaLists.id, users.id)
        .orderBy(orderDirection(likesCount))
        .limit(args.limit)
        .offset(args.offset)

      return this.selectMediaListsWithCount({
        itemsQuery,
        countWhere: where,
        currentUserId: args.currentUserId,
      })
    }

    return this.selectMediaListsWithCount({
      itemsQuery: this.selectMediaLists({
        where,
        limit: args.limit,
        offset: args.offset,
        orderBy: orderDirection(mediaLists[args.sortBy]),
      }),
      countWhere: where,
      currentUserId: args.currentUserId,
    })
  }

  async getWeakTop(args: Parameters<CommunityListsRepositoryInterface["getWeakTop"]>[0]) {
    const titleCondition = this.getTitleCondition(args.title)
    const orderDirection = this.getOrderDirection(args.sortDirection)
    const where = [
      eq(mediaLists.accessLevel, MediaListAccessLevelEnum.PUBLIC),
      sql`exists
      (select 1
       from ${mediaListViews}
       where ${mediaListViews.mediaListId} = ${mediaLists.id}
         and ${mediaListViews.updatedAt} >= ${args.fromDate})`,
      sql`exists
          (select 1 from ${mediaItems} where ${mediaItems.mediaListId} = ${mediaLists.id})`,
      ...(titleCondition ? [titleCondition] : []),
    ]

    if (args.sortBy === "views") {
      const viewsCount = count(mediaListViews.id)
      const itemsQuery = this.drizzle.client
        .select({ mediaList: mediaLists, user: users })
        .from(mediaLists)
        .leftJoin(users, eq(users.id, mediaLists.userId))
        .leftJoin(mediaListViews, eq(mediaListViews.mediaListId, mediaLists.id))
        .where(and(...where))
        .groupBy(mediaLists.id, users.id)
        .orderBy(orderDirection(viewsCount))
        .limit(args.limit)
        .offset(args.offset)

      return this.selectMediaListsWithCount({
        itemsQuery,
        countWhere: where,
        currentUserId: args.currentUserId,
      })
    }

    return this.selectMediaListsWithCount({
      itemsQuery: this.selectMediaLists({
        where,
        limit: args.limit,
        offset: args.offset,
        orderBy: orderDirection(mediaLists[args.sortBy]),
      }),
      countWhere: where,
      currentUserId: args.currentUserId,
    })
  }

  async getNewest(args: Parameters<CommunityListsRepositoryInterface["getNewest"]>[0]) {
    const titleCondition = this.getTitleCondition(args.title)
    const orderDirection = this.getOrderDirection(args.sortDirection)
    const where = [
      eq(mediaLists.accessLevel, MediaListAccessLevelEnum.PUBLIC),
      sql`exists
          (select 1 from ${mediaItems} where ${mediaItems.mediaListId} = ${mediaLists.id})`,
      ...(titleCondition ? [titleCondition] : []),
    ]

    return this.selectMediaListsWithCount({
      itemsQuery: this.selectMediaLists({
        where,
        limit: args.limit,
        offset: args.offset,
        orderBy: orderDirection(mediaLists[args.sortBy]),
      }),
      countWhere: where,
      currentUserId: args.currentUserId,
    })
  }

  async getAllWithMedia(args: Parameters<CommunityListsRepositoryInterface["getAllWithMedia"]>[0]) {
    const titleCondition = this.getTitleCondition(args.title)
    const where = [
      eq(mediaLists.accessLevel, MediaListAccessLevelEnum.PUBLIC),
      sql`exists
      (select 1
       from ${mediaItems}
       where ${mediaItems.mediaListId} = ${mediaLists.id}
         and ${mediaItems.mediaId} = ${args.mediaId})`,
      ...(titleCondition ? [titleCondition] : []),
    ]

    return this.selectMediaListsWithCount({
      itemsQuery: this.selectMediaLists({
        where,
        limit: args.limit,
        offset: args.offset,
        orderBy: desc(mediaLists.updatedAt),
      }),
      countWhere: where,
      currentUserId: args.currentUserId,
    })
  }
}
