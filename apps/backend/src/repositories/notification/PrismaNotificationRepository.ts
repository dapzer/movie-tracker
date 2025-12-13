import { Notification, Prisma } from "@movie-tracker/database"
import { NotificationType, NotificationTypeEnum } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { NotificationRepositoryInterface } from "@/repositories/notification/NotificationRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

interface NotificationRawResult {
  id: string
  user_id: string
  type: string
  meta: Prisma.JsonValue
  read_at: Date | null
  created_at: Date
  actorUser_id: string | null
  actorUser_name: string | null
  actorUser_image: string | null
  mediaList_id: string | null
  mediaList_title: string | null
}

@Injectable()
export class PrismaNotificationRepository implements NotificationRepositoryInterface {
  private convertToInterface(data: Notification | NotificationRawResult): NotificationType {
    if ("user_id" in data) {
      let meta: NotificationType["meta"]
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
            type: NotificationTypeEnum[data.type],
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
        default:
          throw new Error(`Unknown notification type: ${data.type}`)
      }

      return {
        id: data.id,
        userId: data.user_id,
        type: NotificationTypeEnum[data.type],
        meta,
        readAt: data.read_at,
        createdAt: data.created_at,
      }
    }

    return {
      id: data.id,
      userId: data.userId,
      type: NotificationTypeEnum[data.type],
      meta: data.meta as unknown as NotificationType["meta"],
      readAt: data.readAt,
      createdAt: data.createdAt,
    }
  }

  constructor(private readonly prisma: PrismaService) {
  }

  async createNotification(args: Parameters<NotificationRepositoryInterface["createNotification"]>[0]) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: args.userId,
        type: args.type,
        meta: args.meta,
        createdAt: args.createdAt,
      },
    })

    return this.convertToInterface(notification)
  }

  async getNotificationsByUserId(args: Parameters<NotificationRepositoryInterface["getNotificationsByUserId"]>[0]) {
    const [notifications, notificationsCount] = await Promise.all([this.prisma.$queryRaw<NotificationRawResult[]>`
        SELECT n.*,
               actor.id    as "actorUser_id",
               actor.name  as "actorUser_name",
               actor.image as "actorUser_image",
               ml.id       as "mediaList_id",
               ml.title    as "mediaList_title"
        FROM notifications n
                 LEFT JOIN users actor ON actor.id::text = n.meta ->> 'actorUserId'
                 LEFT JOIN media_lists ml ON ml.id::text = n.meta ->> 'mediaListId'
        WHERE n.user_id = ${args.userId}
        ORDER BY n.created_at DESC
        LIMIT ${args.limit} OFFSET ${args.offset};
    `, this.prisma.notification.count({
      where: {
        userId: args.userId,
      },
    })])

    return {
      items: notifications.map(this.convertToInterface),
      totalCount: notificationsCount,
    }
  }
}
