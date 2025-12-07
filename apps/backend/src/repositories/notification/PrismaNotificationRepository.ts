import { Notification } from "@movie-tracker/database"
import { NotificationType, NotificationTypeEnum } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { NotificationRepositoryInterface } from "@/repositories/notification/NotificationRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaNotificationRepository implements NotificationRepositoryInterface {
  private convertToInterface(data: Notification): NotificationType {
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
}
