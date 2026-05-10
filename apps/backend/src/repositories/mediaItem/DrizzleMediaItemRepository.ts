import { mediaDetails, mediaItems, mediaLists, trackingData } from "@movie-tracker/database"
import { and, desc, eq, inArray, sql } from "@movie-tracker/database/drizzle"
import {
  MediaItemsCountByStatusType,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemType,
  MediaTypeEnum,
  SortOrderEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { asc, count, or } from "drizzle-orm"
import { MediaItemRepositoryInterface } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type MediaItemRow = typeof mediaItems.$inferSelect
type MediaDetailsRow = typeof mediaDetails.$inferSelect
type TrackingDataRow = typeof trackingData.$inferSelect

@Injectable()
export class DrizzleMediaItemRepository implements MediaItemRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertTrackingDataToInterface(
    data?: TrackingDataRow | null,
  ): MediaItemTrackingDataType | null {
    if (!data) {
      return null
    }

    return {
      id: data.id,
      mediaItemId: data.mediaItemId,
      currentStatus: MediaItemStatusNameEnum[data.currentStatus],
      note: data.note,
      score: data.score,
      sitesToView: data.sitesToView,
      tvProgress: data.tvProgress,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  private convertToInterface(args: {
    mediaItem: MediaItemRow
    mediaDetails?: MediaDetailsRow | null
    trackingData?: TrackingDataRow | null
  }): MediaItemType {
    return {
      id: args.mediaItem.id,
      mediaDetailsId: args.mediaItem.mediaDetailsId,
      mediaId: args.mediaItem.mediaId,
      mediaType: MediaTypeEnum[args.mediaItem.mediaType.toUpperCase()],
      mediaListId: args.mediaItem.mediaListId,
      trackingData: this.convertTrackingDataToInterface(args.trackingData),
      mediaDetails: args.mediaDetails
        ? {
            id: args.mediaDetails.id,
            mediaType: MediaTypeEnum[args.mediaDetails.mediaType.toUpperCase()],
            mediaId: args.mediaDetails.mediaId,
            score: args.mediaDetails.score ? Number(args.mediaDetails.score) : 0,
            releaseDate: args.mediaDetails.releaseDate || undefined,
            status: args.mediaDetails.status,
            genres: args.mediaDetails.genres,
            ru: args.mediaDetails.ru,
            en: args.mediaDetails.en,
            createdAt: args.mediaDetails.createdAt,
            updatedAt: args.mediaDetails.updatedAt,
          }
        : undefined,
      createdAt: args.mediaItem.createdAt,
      updatedAt: args.mediaItem.updatedAt,
    }
  }

  private getSearchCondition(search?: string) {
    if (!search) {
      return undefined
    }

    const pattern = `%${search.toLowerCase()}%`

    return or(
      sql`lower(${mediaDetails.en} ->> 'title') LIKE ${pattern}`,
      sql`lower(${mediaDetails.en} ->> 'originalTitle') LIKE ${pattern}`,
      sql`lower(${mediaDetails.ru} ->> 'title') LIKE ${pattern}`,
    )
  }

  private async getWithRelationsByIds(ids: string[]) {
    if (!ids.length) {
      return []
    }

    const rows = await this.drizzle.client
      .select({ mediaItem: mediaItems, mediaDetails, trackingData })
      .from(mediaItems)
      .leftJoin(mediaDetails, eq(mediaDetails.id, mediaItems.mediaDetailsId))
      .leftJoin(trackingData, eq(trackingData.mediaItemId, mediaItems.id))
      .where(inArray(mediaItems.id, ids))

    return rows.map(row => this.convertToInterface({
      mediaItem: row.mediaItem,
      mediaDetails: row.mediaDetails,
      trackingData: row.trackingData,
    }))
  }

  async getAll() {
    const rows = await this.drizzle.client
      .select({ mediaItem: mediaItems, mediaDetails, trackingData })
      .from(mediaItems)
      .leftJoin(mediaDetails, eq(mediaDetails.id, mediaItems.mediaDetailsId))
      .leftJoin(trackingData, eq(trackingData.mediaItemId, mediaItems.id))

    return rows.map(row => this.convertToInterface({
      mediaItem: row.mediaItem,
      mediaDetails: row.mediaDetails,
      trackingData: row.trackingData,
    }))
  }

  async getById(id: string) {
    const [row] = await this.drizzle.client
      .select({ mediaItem: mediaItems, mediaDetails, trackingData })
      .from(mediaItems)
      .leftJoin(mediaDetails, eq(mediaDetails.id, mediaItems.mediaDetailsId))
      .leftJoin(trackingData, eq(trackingData.mediaItemId, mediaItems.id))
      .where(eq(mediaItems.id, id))
      .limit(1)

    return row
      ? this.convertToInterface({
          mediaItem: row.mediaItem,
          mediaDetails: row.mediaDetails,
          trackingData: row.trackingData,
        })
      : null
  }

  async getByIds(ids: string[]) {
    return this.getWithRelationsByIds(ids)
  }

  async getByUserId(userId: string) {
    const rows = await this.drizzle.client
      .select({ mediaItem: mediaItems, mediaDetails, trackingData })
      .from(mediaItems)
      .innerJoin(mediaLists, eq(mediaLists.id, mediaItems.mediaListId))
      .leftJoin(mediaDetails, eq(mediaDetails.id, mediaItems.mediaDetailsId))
      .leftJoin(trackingData, eq(trackingData.mediaItemId, mediaItems.id))
      .where(eq(mediaLists.userId, userId))

    return rows.map(row => this.convertToInterface({
      mediaItem: row.mediaItem,
      mediaDetails: row.mediaDetails,
      trackingData: row.trackingData,
    }))
  }

  async getByListId(args: Parameters<MediaItemRepositoryInterface["getByListId"]>[0]) {
    const search = args.search?.trim()
    const sortBy = args.sortBy ?? "createdAt"
    const sortDirection = args.sortDirection ?? SortOrderEnum.DESC
    const searchCondition = this.getSearchCondition(search)

    const conditions = [eq(mediaItems.mediaListId, args.mediaListId)]
    if (args.mediaType) {
      conditions.push(eq(mediaItems.mediaType, args.mediaType))
    }
    if (args.status) {
      conditions.push(eq(trackingData.currentStatus, args.status))
    }
    if (searchCondition) {
      conditions.push(searchCondition)
    }

    const [items, [totalCountResult]] = await Promise.all([
      this.drizzle.client
        .select({ mediaItem: mediaItems, mediaDetails, trackingData })
        .from(mediaItems)
        .leftJoin(mediaDetails, eq(mediaDetails.id, mediaItems.mediaDetailsId))
        .leftJoin(trackingData, eq(trackingData.mediaItemId, mediaItems.id))
        .where(and(...conditions))
        .orderBy(sortDirection === SortOrderEnum.ASC
          ? asc(trackingData[sortBy])
          : desc(trackingData[sortBy]))
        .limit(typeof args.limit === "number" ? args.limit : 20)
        .offset(typeof args.offset === "number" ? args.offset : 0),
      this.drizzle.client
        .select({ count: count() })
        .from(mediaItems)
        .leftJoin(mediaDetails, eq(mediaDetails.id, mediaItems.mediaDetailsId))
        .leftJoin(trackingData, eq(trackingData.mediaItemId, mediaItems.id))
        .where(and(...conditions)),
    ])

    return {
      items: items.map(item => this.convertToInterface({
        mediaItem: item.mediaItem,
        mediaDetails: item.mediaDetails,
        trackingData: item.trackingData,
      })),
      totalCount: totalCountResult.count ?? 0,
    }
  }

  async getByMediaId(args: Parameters<MediaItemRepositoryInterface["getByMediaId"]>[0]) {
    const rows = await this.drizzle.client
      .select({ mediaItem: mediaItems, trackingData })
      .from(mediaItems)
      .innerJoin(mediaLists, eq(mediaLists.id, mediaItems.mediaListId))
      .leftJoin(trackingData, eq(trackingData.mediaItemId, mediaItems.id))
      .where(
        and(
          eq(mediaItems.mediaId, args.mediaId),
          eq(mediaLists.userId, args.userId),
        ),
      )

    return rows.map(row => this.convertToInterface({
      mediaItem: row.mediaItem,
      trackingData: row.trackingData,
    }))
  }

  async create(args: Parameters<MediaItemRepositoryInterface["create"]>[0]) {
    const [mediaItem] = await this.drizzle.client
      .insert(mediaItems)
      .values({
        mediaListId: args.mediaListId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        mediaDetailsId: args.mediaDetailsId,
        createdAt: args.createdAt,
      })
      .returning()

    await this.drizzle.client
      .insert(trackingData)
      .values({
        mediaItemId: mediaItem.id,
        score: null,
        sitesToView: [],
        tvProgress: {
          currentSeason: 0,
          currentEpisode: 1,
        },
        currentStatus: args.currentStatus,
        createdAt: args.createdAt,
      })

    const [result] = await this.getWithRelationsByIds([mediaItem.id])
    return result
  }

  async createMany(args: Parameters<MediaItemRepositoryInterface["createMany"]>[0]) {
    if (!args.length) {
      return []
    }

    const createdIds = await this.drizzle.client.transaction(async (tx) => {
      const ids: string[] = []
      for (const item of args) {
        const [mediaItem] = await tx
          .insert(mediaItems)
          .values({
            mediaListId: item.mediaListId,
            mediaId: item.mediaId,
            mediaType: item.mediaType,
            mediaDetailsId: item.mediaDetailsId,
            createdAt: item.createdAt,
          })
          .returning()

        await tx
          .insert(trackingData)
          .values({
            mediaItemId: mediaItem.id,
            score: null,
            sitesToView: [],
            tvProgress: {
              currentSeason: 0,
              currentEpisode: 1,
            },
            currentStatus: item.currentStatus,
            createdAt: item.createdAt,
          })

        ids.push(mediaItem.id)
      }

      return ids
    })

    return this.getWithRelationsByIds(createdIds)
  }

  async createWithExistedData(
    args: Parameters<MediaItemRepositoryInterface["createWithExistedData"]>[0],
  ) {
    const [mediaItem] = await this.drizzle.client
      .insert(mediaItems)
      .values({
        mediaListId: args.mediaListId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        mediaDetailsId: args.mediaDetailsId,
        createdAt: args.createdAt,
      })
      .returning()

    await this.drizzle.client
      .insert(trackingData)
      .values({
        mediaItemId: mediaItem.id,
        score: args.trackingData.score,
        note: args.trackingData.note,
        sitesToView: args.trackingData.sitesToView,
        tvProgress: args.trackingData.tvProgress,
        createdAt: args.createdAt,
      })

    const [result] = await this.getWithRelationsByIds([mediaItem.id])
    return result
  }

  async delete(id: string) {
    const [existing] = await this.getWithRelationsByIds([id])

    await this.drizzle.client
      .delete(mediaItems)
      .where(eq(mediaItems.id, id))
      .returning()

    return existing ?? null
  }

  async update(args: Parameters<MediaItemRepositoryInterface["update"]>[0]) {
    await this.drizzle.client
      .update(mediaItems)
      .set(args.data)
      .where(eq(mediaItems.id, args.id))

    const [result] = await this.getWithRelationsByIds([args.id])
    return result
  }

  async updateMany(args: Parameters<MediaItemRepositoryInterface["updateMany"]>[0]) {
    if (!args.length) {
      return []
    }

    const ids = args.map(item => item.id)
    await this.drizzle.client.transaction(async (tx) => {
      for (const item of args) {
        await tx
          .update(mediaItems)
          .set(item.data)
          .where(eq(mediaItems.id, item.id))
      }
    })

    return this.getWithRelationsByIds(ids)
  }

  async deleteMany(ids: string[]) {
    if (!ids.length) {
      return []
    }

    const existing = await this.getWithRelationsByIds(ids)

    await this.drizzle.client
      .delete(mediaItems)
      .where(inArray(mediaItems.id, ids))

    return existing
  }

  async getCountByListId(args: Parameters<MediaItemRepositoryInterface["getCountByListId"]>[0]) {
    const initialStatusCounts: MediaItemsCountByStatusType = {
      [MediaItemStatusNameEnum.WATCHING_NOW]: 0,
      [MediaItemStatusNameEnum.NOT_VIEWED]: 0,
      [MediaItemStatusNameEnum.WAIT_NEW_PART]: 0,
      [MediaItemStatusNameEnum.VIEWED]: 0,
      total: 0,
    }

    const search = args.search?.trim()
    const searchCondition = this.getSearchCondition(search)
    const conditions = [eq(mediaItems.mediaListId, args.mediaListId)]
    if (searchCondition) {
      conditions.push(searchCondition)
    }

    const items = await this.drizzle.client
      .select({ id: mediaItems.id })
      .from(mediaItems)
      .leftJoin(mediaDetails, eq(mediaDetails.id, mediaItems.mediaDetailsId))
      .where(and(...conditions))

    const mediaItemIds = items.map(item => item.id)
    if (!mediaItemIds.length) {
      return initialStatusCounts
    }

    const statusCounts = await this.drizzle.client
      .select({ status: trackingData.currentStatus, count: count() })
      .from(trackingData)
      .where(inArray(trackingData.mediaItemId, mediaItemIds))
      .groupBy(trackingData.currentStatus)

    return statusCounts.reduce((acc, item) => {
      const status = item.status as MediaItemStatusNameEnum
      acc[status] = Number(item.count)
      acc.total += Number(item.count)
      return acc
    }, { ...initialStatusCounts })
  }

  async getAllCount() {
    const [result] = await this.drizzle.client
      .select({ count: count() })
      .from(mediaItems)

    return result?.count ?? 0
  }
}
