import type { InferSelectModel, SQL } from "drizzle-orm"
import { mediaDetails, mediaLists, notifications, users } from "@movie-tracker/database"
import { and, eq, inArray, sql } from "@movie-tracker/database/drizzle"
import {
  ExtractNotificationMetaResponseType,
  MediaDetailsInfoType,
  MediaTypeEnum,
  NotificationType,
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { count, isNull } from "drizzle-orm"
import { NotificationRepositoryInterface } from "@/repositories/notification/NotificationRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type NotificationRow = InferSelectModel<typeof notifications>

interface NotificationRawResult {
  id: string
  user_id: string
  type: string
  meta: unknown
  read_at: Date | null
  created_at: Date
  actorUser_id: string | null
  actorUser_name: string | null
  actorUser_image: string | null
  mediaList_id: string | null
  mediaList_title: string | null
  mediaDetails_id: string | null
  mediaDetails_mediaId: number | null
  mediaDetails_mediaType: string | null
  mediaDetails_score: string | number | null
  mediaDetails_status: string | null
  mediaDetails_releaseDate: string | null
  mediaDetails_genres: number[] | null
  mediaDetails_en: unknown | null
  mediaDetails_ru: unknown | null
  mediaDetails_createdAt: Date | null
  mediaDetails_updatedAt: Date | null
}

@Injectable()
export class DrizzleNotificationRepository implements NotificationRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {
  }

  private convertToInterface(data: NotificationRow | NotificationRawResult): NotificationType {
    if ("user_id" in data) {
      let meta = data.meta as unknown

      switch (data.type) {
        case NotificationTypeEnum.USER_FOLLOW:
          meta = {
            type: NotificationTypeEnum.USER_FOLLOW,
            actorUser: {
              id: data.actorUser_id!,
              name: data.actorUser_name!,
              image: data.actorUser_image!,
            },
          }
          break
        case NotificationTypeEnum.MEDIA_LIST_LIKE:
          meta = {
            type: NotificationTypeEnum.MEDIA_LIST_LIKE,
            actorUser: {
              id: data.actorUser_id!,
              name: data.actorUser_name!,
              image: data.actorUser_image!,
            },
            mediaList: {
              id: data.mediaList_id!,
              title: data.mediaList_title!,
            },
          }
          break
        case NotificationTypeEnum.MEDIA_RELEASE: {
          const typedMeta = meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.MEDIA_RELEASE>
          meta = {
            type: NotificationTypeEnum.MEDIA_RELEASE,
            mediaDetails: {
              id: data.mediaDetails_id!,
              mediaId: data.mediaDetails_mediaId!,
              mediaType: data.mediaDetails_mediaType as MediaTypeEnum,
              score: data.mediaDetails_score ? Number(data.mediaDetails_score) : 0,
              releaseDate: data.mediaDetails_releaseDate || undefined,
              en: data.mediaDetails_en as MediaDetailsInfoType,
              ru: data.mediaDetails_ru as MediaDetailsInfoType,
              genres: data.mediaDetails_genres,
              status: data.mediaDetails_status,
              createdAt: data.mediaDetails_createdAt!,
              updatedAt: data.mediaDetails_updatedAt!,
            },
            episodes: typedMeta?.episodes,
          } satisfies ExtractNotificationMetaResponseType<NotificationTypeEnum.MEDIA_RELEASE>
          break
        }
        case NotificationTypeEnum.MEDIA_STATUS_UPDATE: {
          const typedMeta = meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.MEDIA_STATUS_UPDATE>
          meta = {
            type: NotificationTypeEnum.MEDIA_STATUS_UPDATE,
            mediaDetails: {
              id: data.mediaDetails_id!,
              mediaId: data.mediaDetails_mediaId!,
              mediaType: data.mediaDetails_mediaType as MediaTypeEnum,
              score: data.mediaDetails_score ? Number(data.mediaDetails_score) : 0,
              releaseDate: data.mediaDetails_releaseDate || undefined,
              en: data.mediaDetails_en as MediaDetailsInfoType,
              ru: data.mediaDetails_ru as MediaDetailsInfoType,
              genres: data.mediaDetails_genres,
              status: data.mediaDetails_status,
              createdAt: data.mediaDetails_createdAt!,
              updatedAt: data.mediaDetails_updatedAt!,
            },
            previousStatus: typedMeta.previousStatus,
            currentStatus: typedMeta.currentStatus,
          } satisfies ExtractNotificationMetaResponseType<NotificationTypeEnum.MEDIA_STATUS_UPDATE>
          break
        }
        default:
          throw new Error(`Unknown notification type: ${data.type}`)
      }

      return {
        id: data.id,
        userId: data.user_id,
        type: NotificationTypeEnum[data.type],
        meta: meta as NotificationType["meta"],
        readAt: data.read_at ?? undefined,
        createdAt: data.created_at,
      }
    }

    return {
      id: data.id,
      userId: data.userId,
      type: NotificationTypeEnum[data.type],
      meta: data.meta as NotificationType["meta"],
      readAt: data.readAt ?? undefined,
      createdAt: data.createdAt,
    }
  }

  async create(args: Parameters<NotificationRepositoryInterface["create"]>[0]) {
    const [notification] = await this.drizzle.client
      .insert(notifications)
      .values({
        userId: args.userId,
        type: args.type,
        meta: args.meta,
        createdAt: args.createdAt,
      })
      .returning()

    return this.convertToInterface(notification)
  }

  async createBulk(args: Parameters<NotificationRepositoryInterface["createBulk"]>[0]) {
    if (!args.length) {
      return []
    }

    const notificationsRows = await this.drizzle.client
      .insert(notifications)
      .values(args.map(arg => ({
        userId: arg.userId,
        type: arg.type,
        meta: arg.meta,
        createdAt: arg.createdAt,
      })))
      .returning()

    return notificationsRows.map(row => this.convertToInterface(row))
  }

  async getByUserId(args: Parameters<NotificationRepositoryInterface["getByUserId"]>[0]) {
    // TODO: Use limit in query after create separated page LIMIT ${args.limit}
    const query = sql`
        SELECT n.*,
               actor.id      as "actorUser_id",
               actor.name    as "actorUser_name",
               actor.image   as "actorUser_image",
               ml.id         as "mediaList_id",
               ml.title      as "mediaList_title",
               md.id         as "mediaDetails_id",
               md.media_id   as "mediaDetails_mediaId",
                md.media_type as "mediaDetails_mediaType",
                md.score      as "mediaDetails_score",
                md.genres     as "mediaDetails_genres",
                md.release_date as "mediaDetails_releaseDate",
                md.status     as "mediaDetails_status",
                md.en         as "mediaDetails_en",
               md.ru         as "mediaDetails_ru",
               md.created_at as "mediaDetails_createdAt",
               md.updated_at as "mediaDetails_updatedAt"
        FROM ${notifications} n
                 LEFT JOIN ${users} actor ON actor.id::text = n.meta ->> 'actorUserId'
                 LEFT JOIN ${mediaLists} ml ON ml.id::text = n.meta ->> 'mediaListId'
                 LEFT JOIN ${mediaDetails} md ON md.id::text = n.meta ->> 'mediaDetailsId'
        WHERE n.user_id = ${args.userId}
        ORDER BY n.created_at DESC
        OFFSET ${args.offset};
    `

    const [notificationsResult, [notificationsCount]] = await Promise.all([
      this.executeRaw(query),
      this.drizzle.client
        .select({ count: count() })
        .from(notifications)
        .where(eq(notifications.userId, args.userId)),
    ])

    return {
      items: notificationsResult.map(this.convertToInterface),
      totalCount: notificationsCount.count ?? 0,
    }
  }

  async markBulkAsRead(args: Parameters<NotificationRepositoryInterface["markBulkAsRead"]>[0]) {
    if (!args.ids.length) {
      return []
    }

    const notificationsRows = await this.drizzle.client
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(
        eq(notifications.userId, args.userId),
        isNull(notifications.readAt),
        inArray(notifications.id, args.ids),
      ))
      .returning()

    return notificationsRows.map(row => this.convertToInterface(row))
  }

  async markAllAsRead(args: Parameters<NotificationRepositoryInterface["markAllAsRead"]>[0]) {
    const notificationsRows = await this.drizzle.client
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(
        eq(notifications.userId, args.userId),
        isNull(notifications.readAt),
      ))
      .returning()

    return notificationsRows.map(row => this.convertToInterface(row))
  }

  async getCountByUserId(args: Parameters<NotificationRepositoryInterface["getCountByUserId"]>[0]) {
    const [result] = await this.drizzle.client
      .select({ count: count() })
      .from(notifications)
      .where(and(
        eq(notifications.userId, args.userId),
        isNull(notifications.readAt),
      ))

    return {
      unread: Number(result?.count ?? 0),
    }
  }

  private async executeRaw(query: SQL): Promise<NotificationRawResult[]> {
    const result = await this.drizzle.client.execute<Record<string, unknown>>(query)
    return (result.rows ?? []) as unknown as NotificationRawResult[]
  }
}
